import { body } from "express-validator";

const newPasswordValidation = body("newPassword")
  .exists()
  .withMessage("New password is required")
  .isString()
  .withMessage("New password should be a string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Length of new password is not correct");

const recoveryCodeValidation = body("recoveryCode")
  .exists()
  .withMessage("Recovery code is required")
  .isString()
  .withMessage("Recovery code should be a string")
  .notEmpty()
  .withMessage("Recovery code is required");

export const newPasswordRecoveryInputValidation = [
  newPasswordValidation,
  recoveryCodeValidation,
];
