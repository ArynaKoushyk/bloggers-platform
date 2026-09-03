import { inject, injectable } from "inversify";
import {
  LIKES_REPOSITORY,
  POSTS_REPOSITORY,
  POSTS_SERVICE,
} from "../../core/composition/di-tokens";
import { IPostsService } from "../interfaces/posts.service-interface";
import { IPostsRepository } from "../interfaces/posts.repository-interface";
import { ILikesRepository } from "../../likes/interfaces/likes.repository-interface";
import { LikeStatus } from "../../likes/types/like-status.type";
import { Result } from "../../core/result/result.type";
import { AuthUserType } from "../../auth/types/auth-user.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { LikeModel } from "../../likes/infrastructure/persistence/mongoose/like.model";

@injectable()
export class UpdatePostLikeStatusUseCase {
  constructor(
    @inject(POSTS_SERVICE) private postsService: IPostsService,
    @inject(POSTS_REPOSITORY) private postsRepository: IPostsRepository,
    @inject(LIKES_REPOSITORY) private likesRepository: ILikesRepository,
  ) {}
  async execute(postId: string, user: AuthUserType, likeStatus: LikeStatus): Promise<Result<null>> {
    const post = await this.postsService.findPostById(postId);
    if (post.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const postDocument = post.data;
    const currentLike = await this.likesRepository.findLike(postId, LikeParentType.Post, user.id);

    if (!currentLike) {
      if (likeStatus === LikeStatus.None) {
        return {
          status: ResultStatus.Success,
          data: null,
          errorsMessages: null,
        };
      }

      if (likeStatus === LikeStatus.Like) {
        postDocument.likesCount += 1;
      }

      if (likeStatus === LikeStatus.Dislike) {
        postDocument.dislikesCount += 1;
      }

      const newLike = new LikeModel({
        parentId: postId,
        parentType: LikeParentType.Post,
        authorId: user.id,
        authorLogin: user.login,
        status: likeStatus,
      });

      await this.likesRepository.save(newLike);
      await this.postsRepository.save(postDocument);
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }

    if (likeStatus === LikeStatus.None) {
      if (currentLike.status === LikeStatus.Like) {
        postDocument.likesCount = Math.max(0, postDocument.likesCount - 1);
      }

      if (currentLike.status === LikeStatus.Dislike) {
        postDocument.dislikesCount = Math.max(0, postDocument.dislikesCount - 1);
      }

      await this.likesRepository.deleteLike(postId, LikeParentType.Post, user.id);
      await this.postsRepository.save(postDocument);
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
        postDocument.likesCount = Math.max(0, postDocument.likesCount - 1);
        postDocument.dislikesCount += 1;
      }

      if (currentLike.status === LikeStatus.Dislike && likeStatus === LikeStatus.Like) {
        postDocument.dislikesCount = Math.max(0, postDocument.dislikesCount - 1);
        postDocument.likesCount += 1;
      }
      await this.postsRepository.save(postDocument);
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
