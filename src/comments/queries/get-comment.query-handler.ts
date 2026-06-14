import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToCommentViewModel } from "../mappers/map-to-comment-view-model.util";
import { commentsQueryRepository } from "../repositories/mongo-comments.query-repository";
import { CommentViewModel } from "../types/comment-view-model";

export const getCommentQueryHandler = {
  async findCommentById(id: string): Promise<Result<CommentViewModel>> {
    const comment = await commentsQueryRepository.findCommentById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToCommentViewModel(comment),
      errorsMessages: null,
    };
  },
};
