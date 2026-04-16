import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Blog } from "../../types/blogs.type";
import { createErrorMessages } from "../../../core/utils/error.utils";

//!!типизация ??
export function getBlogHandler(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);
  if (!blog) {
    res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: "id",
          message: "Blog not found",
        },
      ]),
    );
    return;
  }
  res.status(HttpStatus.Ok).send(blog);
}
