import { COMMENTS_QUERY_REPOSITORY, POSTS_REPOSITORY } from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
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
  ) {}
  async findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
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
  }
}
