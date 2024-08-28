import { Response } from 'express';
import { MetaData } from './paginate';

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any[]
) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    errors,
  });
};

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  data: any = null,
  message?: string,
  meta?:MetaData
) => {
  return res.status(statusCode).json({
    status: 'success',
    message: message || 'Operation successful',
    data,
    meta
  });
};
