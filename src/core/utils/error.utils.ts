import { ValidationError } from "./validation-error";

export const createErrorMessages = (
  errors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
  return { errorsMessages: errors.length === 0 ? [] : errors };
};
