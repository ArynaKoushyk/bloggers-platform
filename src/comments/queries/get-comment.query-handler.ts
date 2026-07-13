import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { ICommentsQueryRepository } from "../interfaces/comments.query.repository-interface";
import { mapToCommentViewModel } from "../mappers/map-to-comment-view-model.util";
import { CommentViewModel } from "../types/comment-view-model";

export class GetCommentQueryHandler {
  constructor(private commentsQueryRepository: ICommentsQueryRepository) {}
  async findCommentById(id: string): Promise<Result<CommentViewModel>> {
    const comment = await this.commentsQueryRepository.findCommentById(id);

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
  }
}

