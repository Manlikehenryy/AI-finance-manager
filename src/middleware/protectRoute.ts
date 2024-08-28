import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../../customRequest";
import { sendErrorResponse } from "../utils/apiResonse";

const protectRoute = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;

    //if token is empty
    if (!token) {
      return sendErrorResponse(res, 401, "Unauthorized - No Token Provided");
    }

    const secret = process.env.JWT_SECRET;

    var decoded: any = null;

    if (secret) {
      decoded = jwt.verify(token, secret);
    }

    //if token is invalid
    if (!decoded) {
      return sendErrorResponse(res, 401, "Unauthorized - Invalid Token");
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return sendErrorResponse(res, 401, "Unauthorized - Invalid Token");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protectRoute;
