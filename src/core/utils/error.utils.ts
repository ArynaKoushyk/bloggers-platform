import { ValidationErrorType } from "./validation-error";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorsMessages: ValidationErrorType[] } => {
  return { errorsMessages: errors.length === 0 ? [] : errors };
};
