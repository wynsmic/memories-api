import { NextFunction, Request, RequestHandler, Response } from "express";
import { NotFound } from "http-errors";

export const routeNotFoundMiddleware: RequestHandler = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!("content" in res)) {
    throw new NotFound();
  }
  return next();
};
