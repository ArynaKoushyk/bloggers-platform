import { inject, injectable } from "inversify";
import { IBlogsRepository } from "../../blogs/interfaces/blogs.repository-interface";
import { BLOGS_REPOSITORY, POSTS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { IPostsQueryRepository } from "../interfaces/posts.query.repository-interface";
import { mapToPaginatedPostViewModel } from "../mappers/map-to-paginated-post-model.util";
import { PostQueryInput } from "../types/post-query.input";
import { PostViewModel } from "../types/post-view-model";

@injectable()
export class GetPostsByBlogIdQueryHandler {
  constructor(
    @inject(POSTS_QUERY_REPOSITORY) private postsQueryRepository: IPostsQueryRepository,
    @inject(BLOGS_REPOSITORY) private blogsRepository: IBlogsRepository,
  ) {}
  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<Result<PaginatedViewModel<PostViewModel>>> {
    //!!брать лучше из квери репозитория или из комманд репо
    const blog = await this.blogsRepository.findBlogById(blogId);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    const { items, totalCount } = await this.postsQueryRepository.findPostsByBlogId(blog.id, query);

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
  }
}
