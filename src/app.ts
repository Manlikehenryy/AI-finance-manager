// src/app.ts
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./db/connectToMongoDB ";


dotenv.config();

const app = express();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.use("/api/auth", authRoutes);
// app.use("/api/task", taskRoutes);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${port}`);
});
