import { Request, Response,NextFunction } from "express";
import {z} from "zod"
import { formatValidationErrors } from "./formatValidationErrors";
import { sendErrorResponse } from "./apiResonse";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the error stack for debugging

 
    if (err instanceof z.ZodError) {
        return sendErrorResponse(res, 400, "Validation failed", err.errors);
      }
  
      return sendErrorResponse(res, 500, "Internal server error");
};