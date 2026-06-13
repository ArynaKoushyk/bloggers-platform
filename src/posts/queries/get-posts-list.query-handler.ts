import { PostQueryInput } from "../types/post-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { PostViewModel } from "../types/post-view-model";
import { postsQueryRepository } from "../repositories/mongo-posts.query-repository";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { Result } from "../../core/result/result.type";

export const getPostListQueryHandler = {
  async findAllPosts(
    query: PostQueryInput,
  ): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    const { items, totalCount } = await postsQueryRepository.findAllPosts(query);

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
  },
};
