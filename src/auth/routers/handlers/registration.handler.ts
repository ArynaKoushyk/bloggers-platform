import { Response } from "express";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../composition/auth.container";
import { RequestWithBody } from "../../../core/types/requests";
import { RegistrationInputDto } from "../../dto/registration.input.dto";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function registrationHandler(
  req: RequestWithBody<RegistrationInputDto>,
  res: Response,
) {
  const result = await authService.registration(req.body);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }

  return res.sendStatus(HttpStatus.NoContent);
}
