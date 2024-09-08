import express from "express";
import {
  hasTokenExpired,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/signout", signOut);

router.get("/has-token-expired", hasTokenExpired);
export default router;
