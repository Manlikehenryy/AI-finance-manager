import express from "express";
import { createTransaction, deleteTransaction, getAllTransactions, getTransaction, getStats, updateTransaction } from "../controllers/transaction.controller";


const router = express.Router();

router.get("/get-stats", getStats);
router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
