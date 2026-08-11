import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AUTH_SERVICE } from "../../core/composition/di-tokens";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../core/types/http-statuses";
import { IAuthService } from "../interfaces/auth.service-interface";
import { GetSecurityDevicesQueryHandler } from "../queries/get-security-devices.query-handler";

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(AUTH_SERVICE) private authService: IAuthService,
    @inject(GetSecurityDevicesQueryHandler)
    private getSecurityDevicesQueryHandler: GetSecurityDevicesQueryHandler,
  ) {}

  async getActiveDevicesHandler(req: Request, res: Response) {
    const refreshTokenPayload = req.refreshTokenPayload;
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await this.getSecurityDevicesQueryHandler.execute(refreshTokenPayload.userId);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    return res.status(HttpStatus.Ok).send(result.data);
  }

  async invalidateOtherSessionsHandler(req: Request, res: Response) {
    const refreshTokenPayload = req.refreshTokenPayload;
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const { userId, deviceId } = refreshTokenPayload;

    const result = await this.authService.invalidateOtherAuthSessions(userId, deviceId);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }

  async invalidateSessionHandler(req: Request<{ deviceId: string }>, res: Response) {
    const refreshTokenPayload = req.refreshTokenPayload;
    if (!refreshTokenPayload) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const userId = refreshTokenPayload.userId;
    const { deviceId } = req.params;

    const result = await this.authService.invalidateAuthSession(userId, deviceId);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }

    return res.sendStatus(HttpStatus.NoContent);
  }
}
