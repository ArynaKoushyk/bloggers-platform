import { Request, Response } from "express";
import { getUserQueryInput } from "../../helpers/get-user-query.input";
import { getUsersListQueryHandler } from "../../queries/get-users-list.query-handler";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getUserListHandler(req: Request, res: Response) {
  const query = getUserQueryInput(req);
  const result = await getUsersListQueryHandler.findAllUsers(query);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
