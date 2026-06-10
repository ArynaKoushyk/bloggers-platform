import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { getPostQueryInput } from "../../helpers/get-post-query.input";
import { getPostListQueryHandler } from "../../queries/get-posts-list.query-handler";
import { PaginatedViewModel } from "../../../core/types/paginated-view.model";
import { PostViewModel } from "../../types/post-view-model";

export async function getPostListHandler(
  req: Request,
  res: Response<PaginatedViewModel<PostViewModel>>,
) {
  const query = getPostQueryInput(req);
  const result = await getPostListQueryHandler.findAllPosts(query);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
