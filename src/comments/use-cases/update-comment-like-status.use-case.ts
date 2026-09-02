import { inject, injectable } from "inversify";
import {
  COMMENTS_REPOSITORY,
  COMMENTS_SERVICE,
  LIKES_REPOSITORY,
} from "../../core/composition/di-tokens";
import { ICommentsService } from "../interfaces/comments.service-interfaces";
import { ICommentsRepository } from "../interfaces/comments.repository-interfaces";
import { ILikesRepository } from "../../likes/interfaces/likes.repository-interface";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LikeStatus } from "../../likes/types/like-status.type";
import { LikeModel } from "../../likes/infrastructure/persistence/mongoose/like.model";
import { Result } from "../../core/result/result.type";

@injectable()
export class UpdateCommentLikeStatusUseCase {
  constructor(
    @inject(COMMENTS_SERVICE) private commentsService: ICommentsService,
    @inject(COMMENTS_REPOSITORY) private commentsRepository: ICommentsRepository,
    @inject(LIKES_REPOSITORY) private likesRepository: ILikesRepository,
  ) {}
  async execute(
    commentId: string,
    authorId: string,
    likeStatus: LikeStatus,
  ): Promise<Result<null>> {
    const comment = await this.commentsService.findCommentById(commentId);
    if (comment.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const commentDocument = comment.data;

    const currentLike = await this.likesRepository.findLike(
      commentId,
      LikeParentType.Comment,
      authorId,
    );

    if (!currentLike) {
      if (likeStatus === LikeStatus.None) {
        return {
          status: ResultStatus.Success,
          data: null,
          errorsMessages: null,
        };
      }

      if (likeStatus === LikeStatus.Like) {
        commentDocument.likesCount += 1;
      }

      if (likeStatus === LikeStatus.Dislike) {
        commentDocument.dislikesCount += 1;
      }

      const newLike = new LikeModel({
        parentId: commentId,
        parentType: LikeParentType.Comment,
        authorId,
        status: likeStatus,
      });

      await this.likesRepository.save(newLike);
      await this.commentsRepository.save(commentDocument);

      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }

    if (likeStatus === LikeStatus.None) {
      if (currentLike.status === LikeStatus.Like) {
        commentDocument.likesCount = Math.max(0, commentDocument.likesCount - 1);
      }

      if (currentLike.status === LikeStatus.Dislike) {
        commentDocument.dislikesCount = Math.max(0, commentDocument.dislikesCount - 1);
      }
      await this.likesRepository.deleteLike(commentId, LikeParentType.Comment, authorId);
      await this.commentsRepository.save(commentDocument);
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }

    if (likeStatus === currentLike.status) {
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }

    if (likeStatus !== currentLike.status) {
      if (currentLike.status === LikeStatus.Like && likeStatus === LikeStatus.Dislike) {
        commentDocument.likesCount = Math.max(0, commentDocument.likesCount - 1);
        commentDocument.dislikesCount += 1;
      }

      if (currentLike.status === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
        commentDocument.dislikesCount = Math.max(0, commentDocument.dislikesCount - 1);
        commentDocument.likesCount += 1;
      }
      await this.commentsRepository.save(commentDocument);
      currentLike.status = likeStatus;
      await this.likesRepository.save(currentLike);
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }
}
