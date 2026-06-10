import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { UpdatePostInputDto } from "../../dto/update-post.input.dto";
import { postsService } from "../../composition/posts.container";

export async function updatePostHandler(
  req: RequestWithParamsAndBody<{ id: string }, UpdatePostInputDto>,
  res: Response,
) {
  const postId = req.params.id;
  const result = await postsService.updatePost(postId, req.body);

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
