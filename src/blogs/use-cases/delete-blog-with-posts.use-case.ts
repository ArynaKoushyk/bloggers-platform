import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IPostsService } from "../../posts/interfaces/posts.service-interface";
import { IBlogsService } from "../interfaces/blogs.service-interface";

export class DeleteBlogWithPostsUseCase {
  constructor(
    private blogsService: IBlogsService,
    private postsService: IPostsService,
  ) {}

  async execute(blogId: string): Promise<Result<null>> {
    const deleteResult = await this.blogsService.deleteBlog(blogId);
    if (deleteResult.status !== ResultStatus.Success) {
      return {
        status: deleteResult.status,
        data: null,
        errorsMessages: null,
      };
    }

    await this.postsService.deletePostsByBlogId(blogId);
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }
}
