import { createDeleteBlogWithPostsUseCase } from "../use-cases/delete-blog-with-posts.use-case";
import { blogsService } from "./blogs.container";
import { postsService } from "../../posts/composition/posts.container";

export const deleteBlogWithPostsUseCase = createDeleteBlogWithPostsUseCase(
  blogsService,
  postsService,
);
