import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { BlogInputDto } from "../../dto/blog-input.dto";


export async  function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const blog = await blogsRepository.findBlogById(id);
  if (!blog) {
   return  res.status(HttpStatus.NotFound).send(
      createErrorMessages([
        {
          field: "id",
          message: "Blog not found",
        },
      ]),
    );

  }
  await blogsRepository.updateBlog(id, req.body);
 return  res.sendStatus(HttpStatus.NoContent);
}
