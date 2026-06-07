import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../applications/posts.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { RequestWithParams } from "../../../core/types/requests";
import { PostQueryInput } from "../../types/post-query.input";
import { mapToPaginatedPostViewModel } from "../../mappers/map-to-paginated-post-model.util";
import { getPostQueryInput } from "../../helpers/get-post-query.input";

export async function getPostsByBlogIdHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  const blogId = req.params.id;
  const query = getPostQueryInput(req);
  const result = await postsService.findPostsByBlogId(blogId, query);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }

  res.status(HttpStatus.Ok).send(mapToPaginatedPostViewModel(result.data));
}
