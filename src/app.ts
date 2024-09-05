// src/app.ts
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB ";
import authRoutes from "./routes/auth.route";
import transactionRoutes from "./routes/transaction.route";
import { errorHandler } from "./utils/errorHandler";
import protectRoute from "./middleware/protectRoute";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
const resend = new Resend("re_4jcNAWa9_7o3HbCFGgBGu6YUKHJHXd6M7");

const port = process.env.PORT || 3000;
app.get("/email", async (req: Request, res: Response) => {
  const { data, error } = await resend.emails.send({
    from: "noreply@resend.dev",
    to: "henrymbamalu1@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
});

app.use("/api/auth", authRoutes);
app.use("/api/transaction", protectRoute, transactionRoutes);

app.use(errorHandler);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${port}`);
});
