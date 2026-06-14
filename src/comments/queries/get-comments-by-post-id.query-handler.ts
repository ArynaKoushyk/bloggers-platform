import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { postsService } from "../../posts/composition/posts.container";
import { mongoPostsRepository } from "../../posts/repositories/mongo-posts.repository";
import { mapToPaginatedCommentViewModel } from "../mappers/map-to-paginated-comment-model.util";
import { commentsQueryRepository } from "../repositories/mongo-comments.query-repository";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentViewModel } from "../types/comment-view-model";

export const getCommentsByPostIdQueryHandler = {
  async findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
  ): Promise<Result<PaginatedViewModel<CommentViewModel>>> {
    const post = await mongoPostsRepository.findPostById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const { items, totalCount } = await commentsQueryRepository.findCommentsByPostId(
      post.id,
      query,
    );

    const paginatedComments = mapToPaginatedCommentViewModel({
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });

    return {
      status: ResultStatus.Success,
      data: paginatedComments,
      errorsMessages: null,
    };
  },
};
