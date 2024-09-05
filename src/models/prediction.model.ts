import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String}, // e.g., Food, Entertainment, Bills
    predictedAmount: { type: Number, required: true },
    timeFrame: { type: String, enum: ['weekly', 'monthly'], required: true },
  },
  { timestamps: true }
);

export enum TimeFrame {
  weekly = 'weekly',
  monthly = 'monthly'
}

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;
