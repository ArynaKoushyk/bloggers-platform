import { blogsQueryRepository } from "../repositories/mongo-blogs.query-repository";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { Result } from "../../core/result/result.type";
import { BlogViewModel } from "../types/blog-view-model";

export const getBlogQueryHandler = {
  async findBlogById(id: string): Promise<Result<BlogViewModel>> {
    const blog = await blogsQueryRepository.findBlogById(id);

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
  },
};
