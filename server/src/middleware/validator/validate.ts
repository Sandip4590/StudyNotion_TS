import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: "ValidationError",
      errors: errors.array().map(err => ({
        message: err.msg,
      })),
    });
  }
  next();
};
