import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

import { APIErrorResult } from "../../../core/result/result.type";
import { UserViewModel } from "../../types/user-view-model";
import { getUserQueryHandler } from "../../queries/get-user.query-handler";

export async function getUserHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<UserViewModel | APIErrorResult>,
) {
  const id = req.params.id;
  const result = await getUserQueryHandler.findUserById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
