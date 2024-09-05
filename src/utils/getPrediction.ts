import * as tf from "@tensorflow/tfjs";

export const getPrediction = async (
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
