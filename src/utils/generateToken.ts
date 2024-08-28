import jwt from "jsonwebtoken";
import { Response } from "express";

const generateTokenAndSetCookie = (userId: any, res: Response) => {
  const secret = process.env.JWT_SECRET;
  var token = "";
  if (secret) {
    token = jwt.sign({ userId }, secret, {
      expiresIn: "3d",
    });
  }

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
