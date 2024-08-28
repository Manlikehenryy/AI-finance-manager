import Budget, {
  idValidationSchema,
  budgetValidationSchema,
  BudgetDocument,
  budgetUpdateValidationSchema,
} from "../models/budget.model";
import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../../customRequest";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResonse";
import { paginate } from "../utils/paginate";

export const createBudget = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { allocatedAmount, spentAmount, category, startDate, endDate } =
      budgetValidationSchema.parse(req.body);

    // Check for overlapping budget
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: category,
      endDate: { $gte: startDate },
    });

    if (existingBudget) {
      return sendErrorResponse(
        res,
        400,
        "A budget with the same category and overlapping date range already exists."
      );
    }

    const newBudget = new Budget({
      allocatedAmount,
      spentAmount,
      category,
      startDate,
      endDate,
      user: req.user._id,
    });

    if (newBudget) {
      await newBudget.save();

      return sendSuccessResponse(
        res,
        201,
        newBudget,
        "Budget created successfully"
      );
    } else {
      return sendErrorResponse(res, 400, "Invalid budget data");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllBudgets = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const budgets = await paginate<BudgetDocument>(Budget, req, {
      query: { user: req.user._id },
    });

    return sendSuccessResponse(res, 200, budgets.data, "", budgets.meta);
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);
    const data = budgetUpdateValidationSchema.parse(req.body);

     // Check for overlapping budget
     const existingBudget = await Budget.findOne({
      user: req.user._id,
      category: data.category,
      endDate: { $gte: data.startDate },
    });

    if (existingBudget) {
      return sendErrorResponse(
        res,
        400,
        "A budget with the same category and overlapping date range already exists."
      );
    }

    var updatedBudget = null;
    updatedBudget = await Budget.findOneAndUpdate({ _id: id, user: req.user._id }, data, {
      new: true,
    });

    if (!updatedBudget) {
      return sendErrorResponse(res, 404, "No budget was found");
    }

    return sendSuccessResponse(res, 200, updatedBudget);
  } catch (error) {
    next(error);
  }
};

export const getBudget = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);

    const budget = await Budget.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return sendErrorResponse(res, 404, "No budget was found");
    }

    return sendSuccessResponse(res, 200, budget);
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = idValidationSchema.parse(req.params);

    const deletedBudget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedBudget) {
      return sendErrorResponse(res, 404, "No budget was found");
    }

    return sendSuccessResponse(res, 200, deletedBudget);
  } catch (error) {
    next(error);
  }
};
