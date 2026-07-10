import { Request, Response } from "express";
import { authService } from "../../composition/auth.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { SETTINGS } from "../../../core/settings/settings";

export async function refreshTokenHandler(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refreshTokens(refreshToken);
  if (result.status === ResultStatus.Unauthorized) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }

  res.cookie("refreshToken", result.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SETTINGS.REFRESH_TOKEN_COOKIE_MAX_AGE,
  });

  return res.status(HttpStatus.Ok).send({ accessToken: result.data.accessToken });
}
