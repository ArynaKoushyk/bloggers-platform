import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { BlogQueryInput } from "../types/blog-query.input";
import { BlogViewModel } from "../types/blog-view-model";
import { mapToPaginatedBlogViewModel } from "../mappers/map-to-blog-paginated-model.util";
import { IBlogsQueryRepository } from "../interfaces/blogs.query.repository-interface";

export class GetBlogsListQueryHandler {
 constructor(  private blogsQueryRepository: IBlogsQueryRepository) {

  }
  async findAllBlogs(query: BlogQueryInput): Promise<Result<PaginatedViewModel<BlogViewModel>>> {
    const { items, totalCount } = await this.blogsQueryRepository.findAllBlogs(query);

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
  }
}

