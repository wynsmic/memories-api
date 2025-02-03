import { Request, Response, NextFunction } from "express";

export const errorMiddleware =  (err: Error, req: Request, res: Response, next: NextFunction) => {
    // 0. Log err
    console.error({
      component: "error-middleware",
      message: `Error: ${JSON.stringify(err)}`,
      data: req.body,
    });
  
    return next();
  };