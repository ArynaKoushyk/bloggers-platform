import { Router } from "express";
import { loginInputValidation } from "../validation/login.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { loginHandler } from "./handlers/login.handler";
import { bearerAuthGuardMiddleware } from "../middlewares/bearer-auth.guard-middleware";
import { meHandler } from "./handlers/me.handler";
import { registrationInputValidation } from "../validation/registration.input.validation";
import { registrationHandler } from "./handlers/registration.handler";
import { registrationEmailResendingHandler } from "./handlers/registration-email-resending.handler";
import { registrationConfirmationHandler } from "./handlers/registration-confirmation.handler";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.input.validation";
import { registrationEmailValidation } from "../validation/registration-email-resending.input.validation";
import { logoutHandler } from "./handlers/logout.handler";
import { refreshTokenHandler } from "./handlers/refresh-token.handler";

export const authRouter = Router({});

authRouter.post("/login", loginInputValidation, inputValidationResultMiddleware, loginHandler);

authRouter.post("/logout", inputValidationResultMiddleware, logoutHandler);

authRouter.post("/refresh-token", inputValidationResultMiddleware, refreshTokenHandler);

authRouter.get("/me", bearerAuthGuardMiddleware, meHandler);

authRouter.post(
  "/registration-confirmation",
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  "/registration",
  registrationInputValidation,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  "/registration-email-resending",
  registrationEmailValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingHandler,
);
