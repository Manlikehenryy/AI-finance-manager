import { Model, Document } from "mongoose";
import { Request } from "express";

export interface MetaData {
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
  nextPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationResult<T> {
  data: T[];
  meta: MetaData;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: object;
  query?: object;
}

export const paginate = async <T extends Document>(
  model: Model<T>,
  req: Request,
  options: PaginationOptions = {}
): Promise<PaginationResult<T>> => {
  const page = options.page || parseInt(req.query.page as string, 10) || 1;
  const perPage =
    options.limit || parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * perPage;
  const sort: any = options.sort || { createdAt: -1 };
  const query = options.query || {};

  // Fetch the data with pagination
  const data = await model.find(query).sort(sort).skip(skip).limit(perPage);

  // Get the total number of documents
  const total = await model.countDocuments(query);

  // Calculate the total number of pages
  const pageCount = Math.ceil(total / perPage);

  // Determine next and previous page values
  const hasNextPage = page < pageCount;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : 0;

  return {
    data,
    meta: {
      page,
      perPage,
      total,
      pageCount,
      nextPage,
      hasNextPage,
      hasPrevPage,
    },
  };
};
