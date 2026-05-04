import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostViewModel } from "../../types/post-view-model";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { createErrorMessages } from "../../../core/utils/error.utils";

//!!! по поводу throw/res
export async function getPostListHandler(
  req: Request,
  res: Response<PostViewModel[]>,
) {
  const posts = await postsRepository.findAllPosts();
  const postViewModels = await Promise.all(
    posts.map(async (post) => {
      const blog = await blogsRepository.findBlogById(post.blogId);
      if (!blog) {
        throw new Error("blog not found");
      }
      return mapToPostViewModel(post, blog.name);
    }),
  );
  return res.status(HttpStatus.Ok).send(postViewModels);
}
