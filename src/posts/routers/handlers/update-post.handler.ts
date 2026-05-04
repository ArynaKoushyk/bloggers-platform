import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { PostInputDto } from "../../dto/post-input.dto";
import { blob } from "node:stream/consumers";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const post = await postsRepository.findPostById(id);

  if (!post) {
    return res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "Post not found" }]));
  }
  const blog = await blogsRepository.findBlogById(req.body.blogId);
  if (!blog) {
    return res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: "id", message: "Blog not found" }]));
  }
  await postsRepository.updatePost(id, req.body);
  return res.sendStatus(HttpStatus.NoContent);
}
