import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../adapters/jwt.adapter";
import { HttpStatus } from "../../core/types/http-statuses";
import { mongoUsersRepository } from "../../users/repositories/mongo-users.repository";

export const bearerAuthGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  const [authType, token] = auth.split(" ");

  if (authType !== "Bearer" || !token) return res.sendStatus(HttpStatus.Unauthorized);

  const payload = await jwtAdapter.verifyAccessToken(token);
  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const user = await mongoUsersRepository.findUserById(payload.userId);
  if (!user) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  req.user = {
    id: user.id,
    login: user.login,
    email: user.email,
  };
  next();
  return;
};
