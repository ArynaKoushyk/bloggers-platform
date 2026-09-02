import { NextFunction, Request, Response } from "express";
import { jwtService, usersRepository } from "../../core/composition/composition-root";

export const optionalAuthGuardMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return next();
  }
  const [authType, token] = auth.split(" ");

  if (authType !== "Bearer" || !token) {
    return next();
  }

  const payload = await jwtService.verifyAccessToken(token);
  if (!payload) {
    return next();
  }

  const user = await usersRepository.findUserById(payload.userId);
  if (!user) {
    return next();
  }

  req.user = {
    id: user.id,
    login: user.login,
    email: user.email,
  };

  return next();
};
