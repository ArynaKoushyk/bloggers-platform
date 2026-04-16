import { Request, Response } from "express";
import { BlogInputDto } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Blog } from "../../types/blogs.type";

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response<Blog>,
) {
  const newBlog = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };
  const createdBlog = blogsRepository.create(newBlog);
  res.status(HttpStatus.Created).send(createdBlog);
}
