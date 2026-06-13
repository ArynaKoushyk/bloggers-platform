import { body } from "express-validator";

export const loginOrEmailValidation = body("loginOrEmail")
  .exists()
  .withMessage("Login or email is required")
  .isString()
  .withMessage("Login or email should be string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Login or email must not be empty");

export const loginPasswordValidation = body("password")
  .exists()
  .withMessage("Password is required")
  .isString()
  .withMessage("Password should be string")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Password must not be empty");

export const loginInputValidation = [
  loginOrEmailValidation,
  loginPasswordValidation,
];
