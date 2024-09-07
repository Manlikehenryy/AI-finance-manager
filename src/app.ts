// src/app.ts
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB ";
import authRoutes from "./routes/auth.route";
import transactionRoutes from "./routes/transaction.route";
import budgetRoutes from "./routes/budget.route";
import { errorHandler } from "./utils/errorHandler";
import protectRoute from "./middleware/protectRoute";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/transaction", protectRoute, transactionRoutes);
app.use("/api/budget", protectRoute, budgetRoutes);

app.use(errorHandler);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${port}`);
});
