import { body } from "express-validator";

export const blogIdValidation = body("blogId")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isNumeric()
  .withMessage("ID must be a numeric string");

export const titleValidation = body("title")
  .isString()
  .withMessage("Title should be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Length of name is not correct");

export const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("Description should be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Length of name is not correct");

export const content = body("content")
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Length of name is not correct");

export const postInputValidation = [
  blogIdValidation,
  titleValidation,
  shortDescriptionValidation,
  content,
];
