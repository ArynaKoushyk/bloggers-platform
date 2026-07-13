import { Router } from "express";
import { loginInputValidation } from "../validation/login.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { bearerAuthGuardMiddleware } from "../middlewares/bearer-auth.guard-middleware";
import { registrationInputValidation } from "../validation/registration.input.validation";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.input.validation";
import { registrationEmailValidation } from "../validation/registration-email-resending.input.validation";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard-middleware";
import { authController } from "../../core/composition/composition-root";
export const authRouter = Router({});

authRouter.post(
  "/login",
  loginInputValidation,
  inputValidationResultMiddleware,
  authController.loginHandler.bind(authController),
);

authRouter.post(
  "/logout",
  refreshTokenGuardMiddleware,
  authController.logoutHandler.bind(authController),
);

authRouter.post(
  "/refresh-token",
  refreshTokenGuardMiddleware,
  authController.refreshTokenHandler.bind(authController),
);

authRouter.get("/me", bearerAuthGuardMiddleware, authController.meHandler.bind(authController));

authRouter.post(
  "/registration-confirmation",
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  authController.registrationConfirmationHandler.bind(authController),
);

authRouter.post(
  "/registration",
  registrationInputValidation,
  inputValidationResultMiddleware,
  authController.registrationHandler.bind(authController),
);

authRouter.post(
  "/registration-email-resending",
  registrationEmailValidation,
  inputValidationResultMiddleware,
  authController.registrationEmailResendingHandler.bind(authController),
);
