import { body } from "express-validator";

const CODE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const registrationCodeValidation = body("code")
  .exists()
  .withMessage("Code is required")
  .isString()
  .matches(CODE_REGEX)
  .withMessage("Code should be UUID");

export const registrationConfirmationValidation = [registrationCodeValidation];
