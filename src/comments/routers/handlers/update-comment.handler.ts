import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { commentsService } from "../../composition/comments.container";
import { UpdateCommentInputDto } from "../../dto/update-comment.input.dto";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function updateCommentHandler(
  req: RequestWithParamsAndBody<{ commentId: string }, UpdateCommentInputDto>,
  res: Response,
) {
  const updateDto = req.body;
  const commentId = req.params.commentId;
  const user = req.user;
  if (!user) return res.sendStatus(HttpStatus.Unauthorized);

  const updateResult = await commentsService.updateComment(commentId, updateDto, user.id);
  if (updateResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(updateResult.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
