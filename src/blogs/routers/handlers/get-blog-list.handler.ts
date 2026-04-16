import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export function getBlogListHandler(req: Request, res: Response) {
  const blogs = blogsRepository.findAll();
  return res.status(HttpStatus.Ok).send(blogs);
}
