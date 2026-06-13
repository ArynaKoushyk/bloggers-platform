import { Router } from "express";
import { loginInputValidation } from "../validation/login.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { loginHandler } from "./handlers/login.handler";

export const authRouter = Router({});

authRouter.post(
  "/login",
  loginInputValidation,
  inputValidationResultMiddleware,
  loginHandler,
);
