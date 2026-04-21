import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export function getPostHandler(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const post = postsRepository.findById(id);
  if (!post) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: "id",
          message: "Post not found",
        },
      ]),
    );
    return;
  }
  const blog = blogsRepository.findById(post.blogId);
  const postWithBlogId = { ...post, blogName: blog?.name };
  return res.status(HttpStatus.Ok).send(postWithBlogId);
}
