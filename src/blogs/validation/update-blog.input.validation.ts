import { body } from "express-validator";

const URL_REGEX = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const updateBlogNameValidation = body("name")
  .isString()
  .withMessage("Name should be string")
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("Length of name is not correct");

export const updateBlogDescriptionValidation = body("description")
  .isString()
  .withMessage("Description should be string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("Length of description is not correct");

export const updateBlogWebsiteUrlValidation = body("websiteUrl")
  .isString()
  .withMessage("Website URL should be a string")
  .trim()
  .isLength({ max: 100 })
  .withMessage("Length of website URL is not correct")
  .matches(URL_REGEX)
  .withMessage("Website URL must be a valid HTTPS URL");

export const updateBlogInputValidation = [
  updateBlogNameValidation,
  updateBlogDescriptionValidation,
  updateBlogWebsiteUrlValidation,
];
