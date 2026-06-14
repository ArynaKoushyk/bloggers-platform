import { Router } from "express";
import { loginInputValidation } from "../validation/login.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { loginHandler } from "./handlers/login.handler";
import { bearerAuthGuardMiddleware } from "../middlewares/bearer-auth.guard-middleware";
import { meHandler } from "./handlers/me.handler";

export const authRouter = Router({});

authRouter.post("/login", loginInputValidation, inputValidationResultMiddleware, loginHandler);

authRouter.get("/me", bearerAuthGuardMiddleware, meHandler);
