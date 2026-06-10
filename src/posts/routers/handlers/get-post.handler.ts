import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { getPostQueryHandler } from "../../queries/get-post.query-handler";
import { PostViewModel } from "../../types/post-view-model";

export async function getPostHandler(
  req: Request<{ id: string }>,
  res: Response<PostViewModel>,
) {
  const id = req.params.id;
  const result = await getPostQueryHandler.findPostById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
