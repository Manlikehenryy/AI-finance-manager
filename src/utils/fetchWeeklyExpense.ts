import moment from "moment";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model";

const fetchWeeklyExpenses = async (
  userId: string
): Promise<{
  transformedWeeklyExpenses: number[];
  lastWeekExpenses: number;
}> => {
  const startOfLastWeek = moment().startOf("isoWeek").subtract(1, "week");
  const startOfSixWeeksAgo = moment().startOf("isoWeek").subtract(6, "week");

  const weeklyExpenses = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        transactionDate: {
          $gte: startOfSixWeeksAgo.toDate(),
          $lt: startOfLastWeek.toDate(),
        },
        type: "expense",
      },
    },
    {
      $group: {
        _id: {
          week: { $week: "$transactionDate" },
          year: { $year: "$transactionDate" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.week": 1 },
    },
  ]);

  const lastWeekExpenses = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        transactionDate: {
          $gte: startOfLastWeek.toDate(),
          $lt: moment().startOf("isoWeek").toDate(),
        },
        type: "expense",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const transformedWeeklyExpenses = weeklyExpenses.map(
    (week) => week.totalAmount
  );

  // If there are fewer than 6 transformed weekly expenses, pad the array with the average value
  const targetLength = 6;
  if (transformedWeeklyExpenses.length < targetLength) {
    const avgExpense = transformedWeeklyExpenses.length
      ? transformedWeeklyExpenses.reduce((a, b) => a + b, 0) /
        transformedWeeklyExpenses.length
      : 0;
    while (transformedWeeklyExpenses.length < targetLength) {
      transformedWeeklyExpenses.push(avgExpense);
    }
  }
  return {
    transformedWeeklyExpenses,
    lastWeekExpenses: lastWeekExpenses[0]?.totalAmount || 0,
  };
};

export default fetchWeeklyExpenses;
