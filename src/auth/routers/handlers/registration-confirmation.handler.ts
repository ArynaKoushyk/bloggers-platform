import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { authService } from "../../composition/auth.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { RequestWithBody } from "../../../core/types/requests";
import { RegistrationConfirmationInputDto } from "../../dto/registration-confirmation.input.dto";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function registrationConfirmationHandler(
  req: RequestWithBody<RegistrationConfirmationInputDto>,
  res: Response,
) {
  const code = req.body;
  const result = await authService.confirmRegistration(code);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }

  return res.sendStatus(HttpStatus.NoContent);
}
