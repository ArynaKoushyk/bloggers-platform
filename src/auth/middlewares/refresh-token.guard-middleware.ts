import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { mongoRefreshSessionRepository } from "../repositories/mongo-refresh-session.repository";
import { SETTINGS } from "../../core/settings/settings";
import { jwtService } from "../../core/composition/composition-root";


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

  const currentRefreshSession = await mongoRefreshSessionRepository.findRefreshSessionBySessionId(
    payload.sessionId,
  );
  if (!currentRefreshSession) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentRefreshSession.refreshToken.expiresAt < new Date()) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentRefreshSession.userId !== payload.userId) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentRefreshSession.isActive !== true) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (currentRefreshSession.refreshToken.id !== payload.jti) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.refreshToken = refreshToken;
  req.refreshTokenPayload = payload;

  next();
  return;
};
