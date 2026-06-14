import { getCommentQueryInput } from "../../helpers/get-comment-query.input";
import { getCommentsByPostIdQueryHandler } from "../../queries/get-comments-by-post-id.query-handler";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Response } from "express";
import { PaginatedViewModel } from "../../../core/types/paginated-view.model";
import { CommentViewModel } from "../../types/comment-view-model";
import { APIErrorResult } from "../../../core/result/result.type";

export async function getCommentsByPostIdListHandler(
  req: RequestWithParams<{ postId: string }>,
  res: Response<PaginatedViewModel<CommentViewModel> | APIErrorResult>,
) {
  const query = getCommentQueryInput(req);
  const postId = req.params.postId;
  const result = await getCommentsByPostIdQueryHandler.findCommentsByPostId(postId, query);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
