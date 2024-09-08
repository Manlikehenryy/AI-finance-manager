import mongoose from "mongoose";
import Transaction from "../models/transaction.model";

function transformData(
  data: { _id: { year: number; month: number }; totalAmount: number }[],
  type: 'expense' | 'income'
) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (Jan = 0, Dec = 11)
  const currentYear = currentDate.getFullYear();

  // Generate the last six months dynamically
  const lastSixMonths: {
    name: string;
    month: number; // 1-12 for month number
    year: number;
    sales: number; // Default sales value
  }[] = [];
  for (let i = 0; i < 6; i++) {
    const monthIndex = (currentMonth - i + 12) % 12; // Handle negative months (for going back in time)
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear; // Adjust year if the month is from the previous year
    lastSixMonths.unshift({
      name: monthNames[monthIndex],
      month: monthIndex + 1, // 1-12 for month number
      year: year,
      sales: 0, // Default sales value
    });
  }

  // Iterate over the provided data and update the lastSixMonths array
  data.forEach((item) => {
    const foundMonth = lastSixMonths.find(
      (month) => month.month === item._id.month && month.year === item._id.year
    );
    if (foundMonth) {
      foundMonth.sales = item.totalAmount;
    }
  });

  // Return the transformed data with sales updated where applicable
  if(type == 'income'){
    return lastSixMonths.map((item) => ({
        name: item.name,
        value: item.sales,
      }));
  }
  else{
    return lastSixMonths.map((item) => ({
        name: item.name,
        sales: item.sales,
      }));
  }

}

function transformCategoryData(
  data: {
    _id: string;
    totalAmount: number;
  }[]
) {
  return data.map((item) => {
    return {
      name: item._id,
      value: item.totalAmount,
    };
  });
}

export const getTransactionStats = async (
  userId: string,
  type: "income" | "expense"
) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: type,
        transactionDate: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$transactionDate" },
          month: { $month: "$transactionDate" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const transformedData = transformData(result, type);
  return transformedData;
};

export const getCategoryStats = async (userId: string) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
      },
    },
    {
      $group: {
        _id: { $toLower: "$category" },
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  const transformedData = transformCategoryData(result);
  return transformedData;
};

export const getTotalTransaction = async (userId: string) => {
  const totalTransactions = await Transaction.countDocuments({
    user: new mongoose.Types.ObjectId(userId), // Match transactions for the current user
  });

  return totalTransactions;
};
