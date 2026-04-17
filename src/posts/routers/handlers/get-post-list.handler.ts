import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";

export function getPostListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  return res.send(HttpStatus.Ok).send(posts);
}
