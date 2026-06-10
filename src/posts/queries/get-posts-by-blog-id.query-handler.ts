import { blogsQueryRepository } from "../../blogs/repositories/mongo-blogs.query-repository";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { postsQueryRepository } from "../repositories/mongo-posts.query-repository";
import { PostQueryInput } from "../types/post-query.input";
import { PostViewModel } from "../types/post-view-model";

export const getPostsByBlogIdQueryHandler = {
  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    const blog = await blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const id = blog._id.toString();
    const { items, totalCount } = await postsQueryRepository.findPostsByBlogId(id, query);

    return {
      status: ResultStatus.Success,
      data: mapToPaginatedPostViewModel({
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      }),
      errorsMessages: null,
    };
  },
};
