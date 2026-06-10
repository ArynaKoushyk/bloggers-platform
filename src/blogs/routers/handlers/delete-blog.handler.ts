import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { deleteBlogWithPostsUseCase } from "../../composition/delete-blog-with-posts.container";

export async function deleteBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  const blogId = req.params.id;
  const deleteResult = await deleteBlogWithPostsUseCase.execute(blogId);
  if (deleteResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(deleteResult.status));
  } else {
    return res.sendStatus(HttpStatus.NoContent);
  }
}
