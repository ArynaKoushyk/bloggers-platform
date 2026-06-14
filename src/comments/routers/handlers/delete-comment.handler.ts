import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/requests";
import { commentsService } from "../../composition/comments.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function deleteCommentHandler(
  req: RequestWithParams<{ commentId: string }>,
  res: Response,
) {
  const commentId = req.params.commentId;
  const user = req.user;
  if (!user) return res.sendStatus(HttpStatus.Unauthorized);

  const deleteResult = await commentsService.deleteComment(commentId, user.id);
  if (deleteResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(deleteResult.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
