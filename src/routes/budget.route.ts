import express from "express";
import { createBudget, deleteBudget, getAllBudgets, getBudget, updateBudget } from "../controllers/budget.controller";


const router = express.Router();

router.post("/", createBudget);
router.get("/", getAllBudgets);
router.get("/:id", getBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
