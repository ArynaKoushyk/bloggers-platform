import { inject, injectable } from "inversify";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import {
  BLOGS_REPOSITORY,
  LIKES_QUERY_REPOSITORY,
  POSTS_QUERY_REPOSITORY,
} from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { PostQueryInput } from "../types/post-query.input";
import { PostViewModel } from "../types/post-view-model";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";
import { LikeStatus } from "../../likes/types/like-status.type";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { mapToLikeDetailsViewModel } from "../../likes/mappers/map-to-like-details-view-model.util";
import { LikeDetailsViewModel } from "../../likes/types/like-details-view-model";

@injectable()
export class GetPostsByBlogIdQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
    @inject(BLOGS_REPOSITORY) private blogsRepository: IBlogsRepository,
    @inject(LIKES_QUERY_REPOSITORY) private likesQueryRepository: ILikesQueryRepository,
  ) {}
  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
    currentUserId?: string,
  ): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const { items, totalCount } = await this.postsQueryRepository.findPostsByBlogId(blog.id, query);

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

    return {
      status: ResultStatus.Success,
      data: mapToPaginatedPostViewModel(
        {
          pagesCount: Math.ceil(totalCount / query.pageSize),
          page: query.pageNumber,
          pageSize: query.pageSize,
          totalCount,
          items,
        },
        myStatuses,
        newestLikesByPost,
      ),
      errorsMessages: null,
    };
  }
}
