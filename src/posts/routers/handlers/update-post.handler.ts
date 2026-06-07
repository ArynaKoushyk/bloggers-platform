import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostInputDto } from "../../dto/post-input.dto";
import { postsService } from "../../applications/posts.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const result = await postsService.updatePost(id, req.body);

  if (result.status === ResultStatus.BadRequest) {
    return res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.errorsMessages });
  }
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
