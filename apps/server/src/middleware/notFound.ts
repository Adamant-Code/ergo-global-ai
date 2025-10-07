import { NotFoundError } from "@/errors/index.js";
import { Request, Response, NextFunction } from "express";

export const notFound = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundError());
};
