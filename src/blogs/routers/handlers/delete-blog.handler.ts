import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsService } from "../../applications/blogs.service";
import { postsService } from "../../../posts/applications/posts.service";
import { RequestWithParams } from "../../../core/types/requests";
import { APIErrorResult } from "../../../core/result/result.type";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function deleteBlogHandler(req: RequestWithParams<{ id: string }>, res: Response) {
  const id = req.params.id;
  const result = await blogsService.deleteBlog(id);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  await postsService.deletePostsByBlogId(id);
  return res.sendStatus(HttpStatus.NoContent);
}
