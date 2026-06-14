import { Request, Response } from "express";
import { MeViewModel } from "../../types/me-view-model";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function meHandler(req: Request, res: Response<MeViewModel>) {
  if (!req.user) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const user = req.user;
  return res.status(HttpStatus.Ok).send({ email: user.email, login: user.login, userId: user.id });
}
