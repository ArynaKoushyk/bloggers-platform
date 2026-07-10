import { Request, Response } from "express";
import { authService } from "../../composition/auth.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function logoutHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  const logoutResult = await authService.logout(refreshToken);
  if (logoutResult.status === ResultStatus.Unauthorized) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (logoutResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(logoutResult.status)).send({
      errorsMessages: logoutResult.errorsMessages,
    });
  }
  return res.sendStatus(HttpStatus.NoContent);
}
