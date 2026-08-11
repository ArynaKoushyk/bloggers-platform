import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { SETTINGS } from "../../core/settings/settings";
import { authSessionRepository, jwtService } from "../../core/composition/composition-root";

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies[SETTINGS.REFRESH_TOKEN_COOKIE_NAME];
  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const currentAuthSession = await authSessionRepository.findAuthSessionByDeviceId(
    payload.deviceId,
  );
  if (!currentAuthSession) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentAuthSession.refreshToken.expiresAt < new Date()) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentAuthSession.userId !== payload.userId) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentAuthSession.isActive !== true) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentAuthSession.refreshToken.id !== payload.jti) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.refreshTokenPayload = payload;

  next();
  return;
};
