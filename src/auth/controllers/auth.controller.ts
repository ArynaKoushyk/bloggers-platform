import { IAuthService } from "../interfaces/auth.service-interface";
import { LoginInputDto } from "../dto/login.input.dto";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { SETTINGS } from "../../core/settings/settings";
import { RequestWithBody } from "../../core/types/requests";
import { Request, Response } from "express";
import { ResultStatus } from "../../core/result/resultCode";
import { HttpStatus } from "../../core/types/http-statuses";
import { MeViewModel } from "../types/me-view-model";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input.dto";
import { RegistrationInputDto } from "../dto/registration.input.dto";
import { inject, injectable } from "inversify";
import { AUTH_SERVICE } from "../../core/composition/di-tokens";
import { PasswordRecoveryInputDto } from "../dto/password-recovery.input.dto";
import { NewPasswordRecoveryInputDto } from "../dto/new-password-recovery.input.dto";

@injectable()
export class AuthController {
  constructor(@inject(AUTH_SERVICE) private authService: IAuthService) {}

  async loginHandler(req: RequestWithBody<LoginInputDto>, res: Response) {
    const loginDto = req.body;
    const deviceInfo = {
      ip: req.ip as string,
      deviceName: req.headers["user-agent"] as string,
    };
    const loginResult = await this.authService.login(loginDto, deviceInfo);
    if (loginResult.status === ResultStatus.Unauthorized) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    if (loginResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(loginResult.status)).send({
        errorsMessages: loginResult.errorsMessages,
      });
    }

    res.cookie(
      SETTINGS.REFRESH_TOKEN_COOKIE_NAME,
      loginResult.data.refreshToken,
      SETTINGS.REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return res.status(HttpStatus.Ok).send({ accessToken: loginResult.data.accessToken });
  }

  async logoutHandler(req: Request, res: Response) {
    const refreshTokenPayload = req.refreshTokenPayload;
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const { userId, deviceId } = refreshTokenPayload;

    const logoutResult = await this.authService.logout(userId, deviceId);
    if (logoutResult.status === ResultStatus.Unauthorized) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    if (logoutResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(logoutResult.status)).send({
        errorsMessages: logoutResult.errorsMessages,
      });
    }

    res.clearCookie(
      SETTINGS.REFRESH_TOKEN_COOKIE_NAME,
      SETTINGS.REFRESH_TOKEN_CLEAR_COOKIE_OPTIONS,
    );
    return res.sendStatus(HttpStatus.NoContent);
  }

  async meHandler(req: Request, res: Response<MeViewModel>) {
    if (!req.user) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const user = req.user;
    return res
      .status(HttpStatus.Ok)
      .send({ email: user.email, login: user.login, userId: user.id });
  }

  async refreshTokenHandler(req: Request, res: Response) {
    const refreshTokenPayload = req.refreshTokenPayload;
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await this.authService.refreshTokens(refreshTokenPayload);
    if (result.status === ResultStatus.Unauthorized) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    res.cookie(
      SETTINGS.REFRESH_TOKEN_COOKIE_NAME,
      result.data.refreshToken,
      SETTINGS.REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return res.status(HttpStatus.Ok).send({ accessToken: result.data.accessToken });
  }

  async registrationConfirmationHandler(
    req: RequestWithBody<RegistrationConfirmationInputDto>,
    res: Response,
  ) {
    const code = req.body;
    const result = await this.authService.confirmRegistration(code);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }
  async registrationEmailResendingHandler(
    req: RequestWithBody<RegistrationEmailResendingInputDto>,
    res: Response,
  ) {
    const email = req.body;
    const result = await this.authService.resendRegistrationEmail(email);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }
    return res.sendStatus(HttpStatus.NoContent);
  }
  async registrationHandler(req: RequestWithBody<RegistrationInputDto>, res: Response) {
    const result = await this.authService.registration(req.body);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }

  async sendPasswordRecoveryEmailHandler(
    req: RequestWithBody<PasswordRecoveryInputDto>,
    res: Response,
  ) {
    const passwordRecoveryInput = req.body;

    const passwordRecoveryResult =
      await this.authService.sendPasswordRecoveryEmail(passwordRecoveryInput);

    if (passwordRecoveryResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(passwordRecoveryResult.status)).send({
        errorsMessages: passwordRecoveryResult.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }

  async resetPasswordWithRecoveryCodeHandler(
    req: RequestWithBody<NewPasswordRecoveryInputDto>,
    res: Response,
  ) {
    const passwordResetInput = req.body;

    const passwordResetResult =
      await this.authService.resetPasswordWithRecoveryCode(passwordResetInput);

    if (passwordResetResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(passwordResetResult.status)).send({
        errorsMessages: passwordResetResult.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }
}
