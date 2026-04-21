import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export function getPostListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  return res.status(HttpStatus.Ok).send(posts);
}
