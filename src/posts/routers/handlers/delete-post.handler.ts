import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { postsService } from "../../composition/posts.container";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  const postId = req.params.id;
  const result = await postsService.deletePost(postId);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
