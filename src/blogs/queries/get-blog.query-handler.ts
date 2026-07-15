import { ResultStatus } from "../../core/result/resultCode";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { Result } from "../../core/result/result.type";
import { BlogViewModel } from "../types/blog-view-model";
import { IBlogsQueryRepository } from "../interfaces/blogs.query.repository-interface";
import { inject, injectable } from "inversify";
import { BLOGS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
@injectable()
export class GetBlogQueryHandler {
  constructor(
    @inject(BLOGS_QUERY_REPOSITORY) private blogsQueryRepository: IBlogsQueryRepository,
  ) {}
  async findBlogById(id: string): Promise<Result<BlogViewModel>> {
    const blog = await this.blogsQueryRepository.findBlogById(id);

    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToBlogViewModel(blog),
      errorsMessages: null,
    };
  }
}
