import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { LoginInputDto } from "../../dto/login.input.dto";
import { authService } from "../../composition/auth.container";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { SETTINGS } from "../../../core/settings/settings";

export async function loginHandler(req: RequestWithBody<LoginInputDto>, res: Response) {
  const loginDto = req.body;

  const loginResult = await authService.login(loginDto);
  if (loginResult.status === ResultStatus.Unauthorized) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  if (loginResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(loginResult.status)).send({
      errorsMessages: loginResult.errorsMessages,
    });
  }

  res.cookie("refreshToken", loginResult.data.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SETTINGS.REFRESH_TOKEN_COOKIE_MAX_AGE,
  });

  return res.status(HttpStatus.Ok).send({ accessToken: loginResult.data.accessToken });
}
