import { body } from "express-validator";

export const updatePostBlogIdValidation = body("blogId")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");

export const updatePostTitleValidation = body("title")
  .exists()
  .isString()
  .withMessage("Title should be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Length of title is not correct");

export const updatePostShortDescriptionValidation = body("shortDescription")
  .exists()
  .isString()
  .withMessage("Description should be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Length of short description is not correct");

export const updatePostContentValidation = body("content")
  .exists()
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Length of content is not correct");

export const updatePostInputValidation = [
  updatePostBlogIdValidation,
  updatePostTitleValidation,
  updatePostShortDescriptionValidation,
  updatePostContentValidation,
];
