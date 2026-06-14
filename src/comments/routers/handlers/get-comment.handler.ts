import { Response } from "express";
import { RequestWithParams } from "../../../core/types/requests";
import { CommentViewModel } from "../../types/comment-view-model";
import { APIErrorResult } from "../../../core/result/result.type";
import { getCommentQueryHandler } from "../../queries/get-comment.query-handler";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getCommentHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<CommentViewModel | APIErrorResult>,
) {
  const id = req.params.id;
  const result = await getCommentQueryHandler.findCommentById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
