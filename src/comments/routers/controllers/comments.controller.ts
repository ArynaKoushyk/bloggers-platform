import { ICommentsService } from "../../interfaces/comments.service-interfaces";
import { Response } from "express";
import { APIErrorResult } from "../../../core/result/result.type";
import { RequestWithParams, RequestWithParamsAndBody } from "../../../core/types/requests";
import { CreateCommentInputDto } from "../../dto/create-comment.input.dto";
import { CommentViewModel } from "../../types/comment-view-model";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PaginatedViewModel } from "../../../core/types/paginated-view.model";
import { getCommentQueryInput } from "../../helpers/get-comment-query.input";
import { UpdateCommentInputDto } from "../../dto/update-comment.input.dto";
import { GetCommentQueryHandler } from "../../queries/get-comment.query-handler";
import { GetCommentsByPostIdQueryHandler } from "../../queries/get-comments-by-post-id.query-handler";

export class CommentsController {
  constructor(
    private commentsService: ICommentsService,
    private getCommentQueryHandler: GetCommentQueryHandler,
    private getCommentsByPostIdQueryHandler: GetCommentsByPostIdQueryHandler,
  ) {}

  async createCommentByPostIdHandler(
    req: RequestWithParamsAndBody<{ postId: string }, CreateCommentInputDto>,
    res: Response<CommentViewModel | APIErrorResult>,
  ) {
    const createDto = req.body;
    const postId = req.params.postId;
    const user = req.user;
    if (!user) return res.sendStatus(HttpStatus.Unauthorized);

    const createResult = await this.commentsService.createComment(postId, createDto, user);
    if (createResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createResult.status)).send({
        errorsMessages: createResult.errorsMessages,
      });
    }
    const commentId = createResult.data;
    const createdCommentResult = await this.getCommentQueryHandler.findCommentById(commentId);
    if (createdCommentResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdCommentResult.status)).send({
        errorsMessages: createdCommentResult.errorsMessages,
      });
    }
    return res.status(HttpStatus.Created).send(createdCommentResult.data);
  }

  async deleteCommentHandler(req: RequestWithParams<{ commentId: string }>, res: Response) {
    const commentId = req.params.commentId;
    const user = req.user;
    if (!user) return res.sendStatus(HttpStatus.Unauthorized);

    const deleteResult = await this.commentsService.deleteComment(commentId, user.id);
    if (deleteResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(deleteResult.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  }

  async getCommentHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response<CommentViewModel | APIErrorResult>,
  ) {
    const id = req.params.id;
    const result = await this.getCommentQueryHandler.findCommentById(id);

    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async getCommentsByPostIdListHandler(
    req: RequestWithParams<{ postId: string }>,
    res: Response<PaginatedViewModel<CommentViewModel> | APIErrorResult>,
  ) {
    const query = getCommentQueryInput(req);
    const postId = req.params.postId;
    const result = await this.getCommentsByPostIdQueryHandler.findCommentsByPostId(postId, query);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async updateCommentHandler(
    req: RequestWithParamsAndBody<{ commentId: string }, UpdateCommentInputDto>,
    res: Response,
  ) {
    const updateDto = req.body;
    const commentId = req.params.commentId;
    const user = req.user;
    if (!user) return res.sendStatus(HttpStatus.Unauthorized);

    const updateResult = await this.commentsService.updateComment(commentId, updateDto, user.id);
    if (updateResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(updateResult.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  }
}


