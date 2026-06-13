import { body } from "express-validator";

const LOGIN_REGEX = /^[a-zA-Z0-9_-]*$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const createUserLoginValidation = body("login")
  .exists()
  .withMessage("Login is required")
  .isString()
  .withMessage("Login should be string")
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("Length of login is not correct")
  .matches(LOGIN_REGEX)
  .withMessage("Login must be a correct login");

export const createUserPasswordValidation = body("password")
  .exists()
  .withMessage("Password is required")
  .isString()
  .withMessage("Password should be string")
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage("Length of password is not correct");

export const createUserEmailValidation = body("email")
  .exists()
  .withMessage("Email is required")
  .isString()
  .withMessage("Email should be a string")
  .trim()
  .matches(EMAIL_REGEX)
  .withMessage("Email must be a correct email");

export const createUserInputValidation = [
  createUserLoginValidation,
  createUserPasswordValidation,
  createUserEmailValidation,
];
