import {  Response } from "express";
import { authService } from "../../composition/auth.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { RegistrationEmailResendingInputDto } from '../../dto/registration-email-resending.input.dto';
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function registrationEmailResendingHandler(
  req: RequestWithBody<RegistrationEmailResendingInputDto>,
  res: Response,
) {
  const email = req.body;
  const result = await authService.resendRegistrationEmail(email);
  if (result.status !== ResultStatus.Success) {
     return res.status(resultCodeToHttpException(result.status)).send({
       errorsMessages: result.errorsMessages,
     });
   }
  return res.sendStatus(HttpStatus.NoContent);
}
