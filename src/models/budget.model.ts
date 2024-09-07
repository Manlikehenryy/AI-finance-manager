import mongoose, { Document, ObjectId } from "mongoose";
import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const budgetValidationSchema = z.object({
  allocatedAmount: z.number().positive(),
  spentAmount: z.number().nonnegative(),
  category: z.string(),
  startDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date()),
  endDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
  }, z.date()),
})
.refine((data) => data.startDate <= data.endDate, {
  message: "startDate must not be greater than endDate",
  path: ["startDate"],
})
.refine((data) => data.endDate >= today, {
  message: "endDate must not be less than today's date",
  path: ["endDate"],
});

export const budgetUpdateValidationSchema = z.object({
  allocatedAmount: z.number().positive(),
  spentAmount: z.number().nonnegative(),
  category: z.string(),
  startDate:  z.string().date("Invalid date"),
  endDate:  z.string().date("Invalid date"),
})
.refine((data) => data.startDate <= data.endDate, {
  message: "startDate must not be greater than endDate",
  path: ["startDate"],
})

export const idValidationSchema = z.object({
  id: z.string({message:"Invalid Id"})
});

export interface BudgetDocument extends Document {
  user: ObjectId;
  allocatedAmount: number;
  spentAmount: number;
  category: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema<BudgetDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g., Food, Entertainment, Bills
    allocatedAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date }, // For a monthly or weekly budget period
  },
  { timestamps: true }
);

const Budget = mongoose.model<BudgetDocument>("Budget", budgetSchema);

export default Budget;
