import { inject, injectable } from "inversify";
import { LIKES_QUERY_REPOSITORY, POSTS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { mapToPostViewModel } from "../mappers/map-to-post-view-model.util";
import { PostViewModel } from "../types/post-view-model";
import { LikeStatus } from "../../likes/types/like-status.type";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { mapToLikeDetailsViewModel } from "../../likes/mappers/map-to-like-details-view-model.util";

@injectable()
export class GetPostQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
    @inject(LIKES_QUERY_REPOSITORY) private likesQueryRepository: ILikesQueryRepository,
  ) {}
  async findPostById(id: string, currentUserId?: string): Promise<Result<PostViewModel>> {
    const post = await this.postsQueryRepository.findPostById(id);

    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const newestLikes = await this.likesQueryRepository.findNewestLikes(id, LikeParentType.Post);
    const newestLikesView = newestLikes.map(mapToLikeDetailsViewModel);

    if (!currentUserId) {
      const viewModel = mapToPostViewModel(post, LikeStatus.None, newestLikesView);
      return {
        status: ResultStatus.Success,
        data: viewModel,
        errorsMessages: null,
      };
    }

    const currentLike = await this.likesQueryRepository.findLike(
      id,
      LikeParentType.Post,
      currentUserId,
    );

    if (currentLike) {
      const viewModel = mapToPostViewModel(post, currentLike.status, newestLikesView);
      return {
        status: ResultStatus.Success,
        data: viewModel,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToPostViewModel(post, LikeStatus.None, newestLikesView),
      errorsMessages: null,
    };
  }
}
