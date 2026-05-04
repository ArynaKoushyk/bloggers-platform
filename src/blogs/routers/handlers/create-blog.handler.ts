import { Request, Response } from "express";
import { BlogInputDto } from "../../dto/blog-input.dto";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { Blog } from "../../types/blogs.type";
import { BlogViewModel } from "../../types/blog-view-model";
import { mapToBlogViewModel } from "../../mappers/map-to-blog-view-model.util";

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response<BlogViewModel>,
) {
  const newBlog: Blog = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date(),
    isMembership: false,
  };
  const createdBlog = await blogsRepository.createBlog(newBlog);
  const blogViewModel = mapToBlogViewModel(createdBlog);
  res.status(HttpStatus.Created).send(blogViewModel);
}
