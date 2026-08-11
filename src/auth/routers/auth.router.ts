import { Router } from "express";
import { loginInputValidation } from "../validation/login.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { bearerAuthGuardMiddleware } from "../middlewares/bearer-auth.guard-middleware";
import { registrationInputValidation } from "../validation/registration.input.validation";
import { registrationConfirmationValidation } from "../validation/registration-confirmation.input.validation";
import { registrationEmailValidation } from "../validation/registration-email-resending.input.validation";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard-middleware";
import { authController } from "../../core/composition/composition-root";
import { apiRateLimitMiddleware } from "../../request-logs/middlewares/api-rate-limit.middleware";
import { passwordRecoveryInputValidation } from "../validation/password-recovery.input.validation";
import { newPasswordRecoveryInputValidation } from "../validation/new-password-recovery.input.validation";
export const authRouter = Router({});

authRouter.post(
  "/login",
  apiRateLimitMiddleware,
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
  apiRateLimitMiddleware,
  registrationConfirmationValidation,
  inputValidationResultMiddleware,
  authController.registrationConfirmationHandler.bind(authController),
);

authRouter.post(
  "/registration",
  apiRateLimitMiddleware,
  registrationInputValidation,
  inputValidationResultMiddleware,
  authController.registrationHandler.bind(authController),
);

authRouter.post(
  "/registration-email-resending",
  apiRateLimitMiddleware,
  registrationEmailValidation,
  inputValidationResultMiddleware,
  authController.registrationEmailResendingHandler.bind(authController),
);

authRouter.post(
  "/password-recovery",
  apiRateLimitMiddleware,
  passwordRecoveryInputValidation,
  inputValidationResultMiddleware,
  authController.sendPasswordRecoveryEmailHandler.bind(authController),
);

authRouter.post(
  "/new-password",
  apiRateLimitMiddleware,
  newPasswordRecoveryInputValidation,
  inputValidationResultMiddleware,
  authController.resetPasswordWithRecoveryCodeHandler.bind(authController),
);
