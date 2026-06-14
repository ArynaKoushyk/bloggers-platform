import { body } from "express-validator";

export const createCommentContentValidation = body("content")
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Length of content is not correct");

export const createCommentInputValidation = [createCommentContentValidation];
