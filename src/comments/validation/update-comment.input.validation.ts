import { body } from "express-validator";

export const updateCommentContentValidation = body("content")
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("Length of content is not correct");

export const updateCommentInputValidation = [updateCommentContentValidation];
