import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogViewModel } from "../../types/blog-view-model";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";

export async function getBlogListHandler(
  req: Request,
  res: Response<BlogViewModel[]>,
) {
  const blogs = await blogsRepository.findAllBlogs();
  const blogViewModels = blogs.map((blog) => mapToBlogViewModel(blog));
  return res.status(HttpStatus.Ok).send(blogViewModels);
}
