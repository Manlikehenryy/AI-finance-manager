import Transaction, {
  idValidationSchema,
  transactionValidationSchema,
} from "../models/transaction.model";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../../customRequest";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResonse";
import { paginate } from "../utils/paginate";
import { TransactionDocument } from "../models/transaction.model";
import Budget from "../models/budget.model";
import { predictExpense } from "../utils/getPrediction";
import { getTotalTransaction, getCategoryStats, getTransactionStats } from '../utils/getStats';

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, category, transactionDate, type, description } =
      transactionValidationSchema.parse(req.body);

    if (type === "expense") {
      await Budget.findOneAndUpdate(
        {
          user: req.user._id,
          category: new RegExp(`^${category}$`, 'i'),
          endDate: { $gte: transactionDate },
          startDate: { $lte: transactionDate },
        },
        { $inc: { spentAmount: amount } },
        { new: true, lean: true }
      );
    }

    const newTransaction = new Transaction({
      amount,
      category,
      transactionDate,
      type,
      description,
      user: req.user._id,
    });

    if (newTransaction) {
      await newTransaction.save();

      return sendSuccessResponse(
        res,
        201,
        newTransaction,
        "Transaction created successfully"
      );
    } else {
      return sendErrorResponse(res, 400, "Invalid transaction data");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await paginate<TransactionDocument>(Transaction, req, {
      query: { user: req.user._id },
    });

    return sendSuccessResponse(
      res,
      200,
      transactions.data,
      "",
      transactions.meta
    );
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);
    const data = transactionValidationSchema.parse(req.body);

    var updatedTask = null;
    updatedTask = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user._id },
      data,
      {
        new: true,
      }
    );

    if (!updatedTask) {
      return sendErrorResponse(res, 404, "No transaction was found");
    }

    return sendSuccessResponse(res, 200, updatedTask);
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return sendErrorResponse(res, 404, "No transaction was found");
    }

    return sendSuccessResponse(res, 200, transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);

    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedTransaction) {
      return sendErrorResponse(res, 404, "No transaction was found");
    }

    return sendSuccessResponse(res, 200, deletedTransaction);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalTransactions = await getTotalTransaction(req.user._id);
    const categoryStats = await getCategoryStats(req.user._id)
    const expenseStats = await getTransactionStats(req.user._id, "expense")
    const incomeStats = await getTransactionStats(req.user._id, "income")
    const currentWeekPrediction = await predictExpense(req.user._id)
    return sendSuccessResponse(res, 200, {totalTransactions, categoryStats, expenseStats, incomeStats, currentWeekPrediction});

  } catch (error) {
    next(error);
  }
};
