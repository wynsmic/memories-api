import { Request, Response, NextFunction } from "express";
import { Logger } from "../../../../infrastructure/logger";

const logger = new Logger();

export const inputLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info({
    component: "Express",
    message: "################## NEW CALL ##################",
    data: req.url,
  });

  //req.body && console.log(req.body);
  return next();
};
