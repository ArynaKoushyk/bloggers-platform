import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../../posts/repositories/posts.repository";

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const id = req.params.id;
  const blog = await blogsRepository.findBlogById(id);
  if (!blog) {
    return res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: "id",
          message: "Blog not found",
        },
      ]),
    );
  }
  await blogsRepository.deleteBlog(id);
  await postsRepository.deletePostByBlogId(id);
  return res.sendStatus(HttpStatus.NoContent);
}
