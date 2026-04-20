import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export function getBlogListHandler(req: Request, res: Response) {
  console.log("its blogs");

  const blogs = blogsRepository.findAll();
  console.log(blogs);

  return res.status(HttpStatus.Ok).send(blogs);
}
