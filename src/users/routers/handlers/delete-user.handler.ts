import { Response } from "express";
import { ResultStatus } from "../../../core/result/resultCode";
import { RequestWithParams } from "../../../core/types/requests";
import { usersService } from "../../composition/users.container";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function deleteUserHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  const userId = req.params.id;
  const deleteResult = await usersService.deleteUser(userId);
  if (deleteResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(deleteResult.status));
  } else {
    return res.sendStatus(HttpStatus.NoContent);
  }
}
