import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { blogsQueryRepository } from "../repositories/mongo-blogs.query-repository";
import { BlogQueryInput } from "../types/blog-query.input";
import { BlogViewModel } from "../types/blog-view-model";
import { mapToPaginatedBlogViewModel } from "../mappers/map-to-blog-paginated-model.util";

export const getBlogsListQueryHandler = {
  async findAllBlogs(
    query: BlogQueryInput,
  ): Promise<Result<PaginatedViewModel<BlogViewModel>>> {
    const { items, totalCount } = await blogsQueryRepository.findAllBlogs(query);

    const paginatedBlogs = mapToPaginatedBlogViewModel({
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
    
    return {
      status: ResultStatus.Success,
      data: paginatedBlogs,
      errorsMessages: null,
    };
  },
};
