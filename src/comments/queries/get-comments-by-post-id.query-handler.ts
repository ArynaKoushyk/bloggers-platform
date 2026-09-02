import {
  COMMENTS_QUERY_REPOSITORY,
  LIKES_QUERY_REPOSITORY,
  POSTS_REPOSITORY,
} from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { ILikesQueryRepository } from "../../likes/interfaces/likes.query-repository-interface";
import { LikeParentType } from "../../likes/types/like-parent.type";
import { LikeStatus } from "../../likes/types/like-status.type";
import { IPostsRepository } from "../../posts/interfaces/posts.repository-interface";
import { ICommentsQueryRepository } from "../interfaces/comments.query.repository-interface";
import { mapToPaginatedCommentViewModel } from "../mappers/map-to-paginated-comment-model.util";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentViewModel } from "../types/comment-view-model";
import { inject, injectable } from "inversify";

@injectable()
export class GetCommentsByPostIdQueryHandler {
  constructor(
    @inject(COMMENTS_QUERY_REPOSITORY) private commentsQueryRepository: ICommentsQueryRepository,
    @inject(POSTS_REPOSITORY) private postsRepository: IPostsRepository,
    @inject(LIKES_QUERY_REPOSITORY) private likesQueryRepository: ILikesQueryRepository,
  ) {}
  async findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
    currentUserId?: string,
  ): Promise<Result<PaginatedViewModel<CommentViewModel>>> {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const { items, totalCount } = await this.commentsQueryRepository.findCommentsByPostId(
      post.id,
      query,
    );

    const myStatuses = new Map<string, LikeStatus>();
    const commentIds = items.map((comment) => comment._id.toString());

    if (currentUserId && commentIds.length > 0) {
      const currentLikes = await this.likesQueryRepository.findLikesByParents(
        commentIds,
        LikeParentType.Comment,
        currentUserId,
      );

      currentLikes.forEach((like) => {
        myStatuses.set(like.parentId, like.status);
      });
    }
    
    const paginatedComments = mapToPaginatedCommentViewModel(
      {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      },
      myStatuses,
    );

    return {
      status: ResultStatus.Success,
      data: paginatedComments,
      errorsMessages: null,
    };
  }
}
