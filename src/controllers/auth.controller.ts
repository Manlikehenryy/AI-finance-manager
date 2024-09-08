import User, { loginValidationSchema } from "../models/user.model";
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { userValidationSchema } from "../models/user.model";
import generateTokenAndSetCookie from "../utils/generateToken";
import { sendErrorResponse, sendSuccessResponse } from "../utils/apiResonse";
import isTokenExpired from "../utils/isTokenExpired";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = userValidationSchema.parse(
      req.body
    );

    const user = await User.findOne({ email });

    if (user) {
      return sendErrorResponse(res, 400, "Email already exists");
    }

    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token here
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return sendSuccessResponse(
        res,
        201,
        {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        "User created successfully"
      );
    } else {
      return sendErrorResponse(res, 400, "Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = loginValidationSchema.parse(req.body);

    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return sendErrorResponse(res, 400, "Invalid username or password");
    }

    generateTokenAndSetCookie(user._id, res);

    return sendSuccessResponse(
      res,
      200,
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      "User logged in successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    return sendSuccessResponse(res, 200, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

export const hasTokenExpired = (req: Request, res: Response, next: NextFunction) =>{
  try {
  const token = req.cookies.jwt;

  if (isTokenExpired(token)) {
    return sendSuccessResponse(res, 200, null, "Session has expired");
  }
  else{
    return sendSuccessResponse(res, 200, null, "Session has not expired");
  }

  
} catch (error) {
  next(error);
}
}