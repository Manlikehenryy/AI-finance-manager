import * as tf from "@tensorflow/tfjs";
import moment from "moment";
import Prediction, { TimeFrame } from "../models/prediction.model";
import fetchWeeklyExpenses from "./fetchWeeklyExpense";

const getPrediction = async (
  normalizedExpenses: number[],
  lastWeekExpenses: number
): Promise<number> => {
  // Define a simple model
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ inputShape: [1], units: 50, activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 50, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });

  // Prepare the training data
  const xs = tf.tensor2d(normalizedExpenses.slice(0, 5).map((x) => [x]));
  const ys = tf.tensor2d(normalizedExpenses.slice(1).map((y) => [y]));

  //train model
  await model.fit(xs, ys, { epochs: 100 });

  // Normalize the input
  const normalizedInput = lastWeekExpenses / 1000;

  // Predict future expense
  const prediction = model.predict(
    tf.tensor2d([normalizedInput], [1, 1])
  ) as tf.Tensor;

  const predictedExpense = prediction.dataSync()[0] * 1000; // Denormalize the output

  return predictedExpense;
};

export const predictExpense = async (userId: string) => {
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
    return existingPrediction.predictedAmount;
  } else {
    const { transformedWeeklyExpenses, lastWeekExpenses } =
      await fetchWeeklyExpenses(userId);

    // Normalize the data
    const normalizedExpenses = transformedWeeklyExpenses.map(
      (expense) => expense / 1000
    );

    const predictedExpense = await getPrediction(
      normalizedExpenses,
      lastWeekExpenses
    );

    const newPrediction = new Prediction({
      user: userId,
      predictedAmount: predictedExpense,
      timeFrame: TimeFrame.weekly,
    });

    if (newPrediction) {
      await newPrediction.save();
    }
    if(predictedExpense < 0){
      return 0;
    }
    return predictedExpense.toFixed(2);
  }
};
