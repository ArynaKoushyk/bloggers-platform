import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithParams } from "../../../core/types/requests";
import { getPostQueryInput } from "../../helpers/get-post-query.input";
import { getPostsByBlogIdQueryHandler } from "../../queries/get-posts-by-blog-id.query-handler";
import { PaginatedViewModel } from "../../../core/types/paginated-view.model";
import { PostViewModel } from "../../types/post-view-model";

export async function getPostsByBlogIdHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response<PaginatedViewModel<PostViewModel>>,
) {
  const blogId = req.params.id;
  const query = getPostQueryInput(req);
  const result = await getPostsByBlogIdQueryHandler.findPostsByBlogId(blogId, query);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  res.status(HttpStatus.Ok).send(result.data);
}
