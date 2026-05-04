import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";

export async function getBlogHandler(
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
  const blogViewModel = mapToBlogViewModel(blog);
  return res.status(HttpStatus.Ok).send(blogViewModel);
}
