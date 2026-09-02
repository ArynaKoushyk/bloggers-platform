import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { ICommentsQueryRepository } from "../interfaces/comments.query.repository-interface";
import { mapToCommentViewModel } from "../mappers/map-to-comment-view-model.util";
import { CommentViewModel } from "../types/comment-view-model";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";
import { inject, injectable } from "inversify";
import {
  COMMENTS_QUERY_REPOSITORY,
  LIKES_QUERY_REPOSITORY,
} from "../../core/composition/di-tokens";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { LikeStatus } from "../../likes/types/like-status.type";

@injectable()
export class GetCommentQueryHandler {
  constructor(
    @inject(COMMENTS_QUERY_REPOSITORY) private commentsQueryRepository: ICommentsQueryRepository,
    @inject(LIKES_QUERY_REPOSITORY) private likesQueryRepository: ILikesQueryRepository,
  ) {}
  async findCommentById(id: string, currentUserId?: string): Promise<Result<CommentViewModel>> {
    const comment = await this.commentsQueryRepository.findCommentById(id);

    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    if (!currentUserId) {
      const viewModel = mapToCommentViewModel(comment, LikeStatus.None);
      return {
        status: ResultStatus.Success,
        data: viewModel,
        errorsMessages: null,
      };
    }

    const currentLike = await this.likesQueryRepository.findLike(
      id,
      LikeParentType.Comment,
      currentUserId,
    );
    if (currentLike) {
      const viewModel = mapToCommentViewModel(comment, currentLike.status);
      return {
        status: ResultStatus.Success,
        data: viewModel,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToCommentViewModel(comment, LikeStatus.None),
      errorsMessages: null,
    };
  }
}
