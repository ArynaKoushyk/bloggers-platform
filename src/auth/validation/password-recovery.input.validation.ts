import { body } from "express-validator";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const passwordRecoveryEmailValidation = body("email")
  .exists()
  .withMessage("Email is required")
  .isString()
  .withMessage("Email should be a string")
  .trim()
  .matches(EMAIL_REGEX)
  .withMessage("Email must be a correct email");

export const passwordRecoveryInputValidation = [passwordRecoveryEmailValidation];
