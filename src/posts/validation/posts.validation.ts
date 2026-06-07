import { body } from "express-validator";

export const blogIdValidation = body("blogId")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");

export const titleValidation = body("title")
  .exists()
  .isString()
  .withMessage("Title should be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Length of name is not correct");

export const shortDescriptionValidation = body("shortDescription")
  .exists()
  .isString()
  .withMessage("Description should be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Length of name is not correct");

export const contentValidation = body("content")
  .exists()
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Length of name is not correct");

export const postInputValidation = [
  blogIdValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];

export const postInputWithoutBlogIdValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
];
