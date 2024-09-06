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
import fetchWeeklyExpenses from "../utils/fetchWeeklyExpense";
import * as tf from "@tensorflow/tfjs";
import Prediction, { TimeFrame } from "../models/prediction.model";
import moment from "moment";
import { getPrediction } from "../utils/getPrediction";

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

export const predictExpense = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentDate = moment();

    const startOfWeek = currentDate.startOf("week").toDate();

    const endOfWeek = currentDate.endOf("week").toDate();

    //checks for prediction within the current week
    const existingPrediction = await Prediction.findOne({
      createdAt: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    if (existingPrediction) {
      return sendSuccessResponse(res, 200, {
        predictedExpense: existingPrediction.predictedAmount,
      });
    } else {
      const { transformedWeeklyExpenses, lastWeekExpenses } =
        await fetchWeeklyExpenses(req.user.id);

      // Normalize the data
      const normalizedExpenses = transformedWeeklyExpenses.map(
        (expense) => expense / 1000
      );

      const predictedExpense = await getPrediction(
        normalizedExpenses,
        lastWeekExpenses
      );

      const newPrediction = new Prediction({
        user: req.user.id,
        predictedAmount: predictedExpense,
        timeFrame: TimeFrame.weekly,
      });

      if (newPrediction) {
        await newPrediction.save();
      }

      return sendSuccessResponse(res, 200, { predictedExpense });
    }
  } catch (error) {
    next(error);
  }
};
