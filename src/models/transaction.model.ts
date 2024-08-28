import mongoose, { Document, ObjectId } from "mongoose";
import { z } from "zod";

export const transactionValidationSchema = z.object({
  amount: z.number(),
  category: z.string(),
  transactionDate: z.string().date("Invalid date").optional(),
  description: z.string().optional(),
  type: z
    .string()
    .regex(/^(income|expense)$/, "Type should be income or expense"),
});

export const idValidationSchema = z.object({
  id: z.string().uuid("Invalid Id")
});



export interface TransactionDocument extends Document {
  user: ObjectId;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  transactionDate: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<TransactionDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., Food, Entertainment, Bills
    transactionDate: { type: Date, default: Date.now },
    description: { type: String },
    type: { type: String, enum: ["income", "expense"], required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<TransactionDocument>("Transaction", transactionSchema);

export default Transaction;
