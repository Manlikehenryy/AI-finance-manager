import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true }, // e.g., Food, Entertainment, Bills
    predictedAmount: { type: Number, required: true },
    predictionDate: { type: Date, default: Date.now },
    timeFrame: { type: String, enum: ['weekly', 'monthly'], required: true },
  },
  { timestamps: true }
);

const Prediction = mongoose.model("Prediction", predictionSchema);

export default Prediction;
