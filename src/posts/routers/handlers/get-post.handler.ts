import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id;
  const post = await postsRepository.findPostById(id);
  if (!post) {
    return res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: "id",
          message: "Post not found",
        },
      ]),
    );
  }
  const blog = await blogsRepository.findBlogById(post.blogId);
  if (!blog) {
    return res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "Blog not found" }]));
  }
  const postViewModel = mapToPostViewModel(post, blog.name);
  return res.status(HttpStatus.Ok).send(postViewModel);
}
