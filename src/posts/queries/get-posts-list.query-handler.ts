import { PostQueryInput } from "../types/post-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { PostViewModel } from "../types/post-view-model";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { Result } from "../../core/result/result.type";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { POSTS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { inject, injectable } from "inversify";

@injectable()
export class GetPostListQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
  ) {}
  async findAllPosts(query: PostQueryInput): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    const { items, totalCount } = await this.postsQueryRepository.findAllPosts(query);

    const paginatedPosts = mapToPaginatedPostViewModel({
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });

    return {
      status: ResultStatus.Success,
      data: paginatedPosts,
      errorsMessages: null,
    };
  }
}
