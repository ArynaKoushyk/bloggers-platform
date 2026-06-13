import { body } from "express-validator";

export const createPostByBlogIdTitleValidation = body("title")
  .exists()
  .isString()
  .withMessage("Title should be a string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Length of title is not correct");

export const createPostByBlogIdShortDescriptionValidation = body("shortDescription")
  .exists()
  .isString()
  .withMessage("Description should be string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Length of short description is not correct");

export const createPostByBlogIdContentValidation = body("content")
  .exists()
  .isString()
  .withMessage("Content should be string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Length of content is not correct");

export const createPostByBlogIdInputValidation = [
  createPostByBlogIdTitleValidation,
  createPostByBlogIdShortDescriptionValidation,
  createPostByBlogIdContentValidation,
];
