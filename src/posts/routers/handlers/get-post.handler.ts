import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../applications/posts.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function getPostHandler(req: Request<{ id: string }>, res: Response) {
  const id = req.params.id;
  const result = await postsService.findPostById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  const postViewModel = mapToPostViewModel(result.data);
  return res.status(HttpStatus.Ok).send(postViewModel);
}
