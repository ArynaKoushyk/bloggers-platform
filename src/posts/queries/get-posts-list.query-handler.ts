import { PostQueryInput } from "../types/post-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { PostViewModel } from "../types/post-view-model";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { Result } from "../../core/result/result.type";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { LIKES_QUERY_REPOSITORY, POSTS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { inject, injectable } from "inversify";
import { LikeStatus } from "../../likes/types/like-status.type";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { LikeDetailsViewModel } from "../../likes/types/like-details-view-model";
import { mapToLikeDetailsViewModel } from "../../likes/mappers/map-to-like-details-view-model.util";

@injectable()
export class GetPostListQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
    @inject(LIKES_QUERY_REPOSITORY) private likesQueryRepository: ILikesQueryRepository,
  ) {}
  async findAllPosts(
    query: PostQueryInput,
    currentUserId?: string,
  ): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    const { items, totalCount } = await this.postsQueryRepository.findAllPosts(query);
    const myStatuses = new Map<string, LikeStatus>();
    const postIds = items.map((post) => post._id.toString());
    const newestLikesByPost = new Map<string, LikeDetailsViewModel[]>();

    if (postIds.length > 0) {
      const newestLikes = await this.likesQueryRepository.findNewestLikesByParents(
        postIds,
        LikeParentType.Post,
      );

      newestLikes.forEach((like) => {
        const postLikes = newestLikesByPost.get(like.parentId) ?? [];

        postLikes.push(mapToLikeDetailsViewModel(like));

        newestLikesByPost.set(like.parentId, postLikes);
      });
    }

    if (currentUserId && postIds.length > 0) {
      const currentLikes = await this.likesQueryRepository.findLikesByParents(
        postIds,
        LikeParentType.Post,
        currentUserId,
      );

      currentLikes.forEach((like) => {
        myStatuses.set(like.parentId, like.status);
      });
    }

    const paginatedPosts = mapToPaginatedPostViewModel(
      {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      },
      myStatuses,
      newestLikesByPost,
    );

    return {
      status: ResultStatus.Success,
      data: paginatedPosts,
      errorsMessages: null,
    };
  }
}
