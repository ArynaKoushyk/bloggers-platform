import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PostsService } from "../../posts/applications/types/posts.service.type";
import { BlogsService } from "../applications/types/blogs.service.type";

export const createDeleteBlogWithPostsUseCase = (
  blogsService: BlogsService,
  postsService: PostsService,
) => ({
  async execute(blogId: string): Promise<Result<null>> {
    const deleteResult = await blogsService.deleteBlog(blogId);
    if (deleteResult.status !== ResultStatus.Success) {
      return {
        status: deleteResult.status,
        data: null,
        errorsMessages: null,
      };
    }

    await postsService.deletePostsByBlogId(blogId);
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  },
});
