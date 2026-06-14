import { Response } from "express";
import { APIErrorResult } from "../../../core/result/result.type";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { CreateCommentInputDto } from "../../dto/create-comment.input.dto";
import { CommentViewModel } from "../../types/comment-view-model";
import { commentsService } from "../../composition/comments.container";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { getCommentQueryHandler } from "../../queries/get-comment.query-handler";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function createCommentByPostIdHandler(
  req: RequestWithParamsAndBody<{ postId: string }, CreateCommentInputDto>,
  res: Response<CommentViewModel | APIErrorResult>,
) {
  const createDto = req.body;
  const postId = req.params.postId;
  const user = req.user;
  if (!user) return res.sendStatus(HttpStatus.Unauthorized);

  const createResult = await commentsService.createComment(postId, createDto, user);
  if (createResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createResult.status)).send({
      errorsMessages: createResult.errorsMessages,
    });
  }
  const commentId = createResult.data;
  const createdCommentResult = await getCommentQueryHandler.findCommentById(commentId);
  if (createdCommentResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createdCommentResult.status)).send({
      errorsMessages: createdCommentResult.errorsMessages,
    });
  }
  return res.status(HttpStatus.Created).send(createdCommentResult.data);
}
