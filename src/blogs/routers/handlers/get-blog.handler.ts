import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { getBlogQueryHandler } from "../../queries/get-blog.query-handler";
import { BlogViewModel } from "../../types/blog-view-model";
import { APIErrorResult } from "../../../core/result/result.type";

export async function getBlogHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModel | APIErrorResult>,
) {
  const id = req.params.id;
  const result = await getBlogQueryHandler.findBlogById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
