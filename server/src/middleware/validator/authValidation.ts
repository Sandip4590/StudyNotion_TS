// middlewares/validators/authValidators.ts
import { body } from "express-validator";
import User from "@/models/User"; // adjust path as needed

export const authValidationRules = {
  loginUser: [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      
  ],
};
