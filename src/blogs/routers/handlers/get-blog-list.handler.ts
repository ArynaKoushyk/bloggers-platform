import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { getBlogQueryInput } from "../../helpers/get-blog-query.input";
import { getBlogsListQueryHandler } from "../../queries/get-blogs-list.query-handler";

export async function getBlogListHandler(req: Request, res: Response) {
  const query = getBlogQueryInput(req);
  const result = await getBlogsListQueryHandler.findAllBlogs(query);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }
  return res.status(HttpStatus.Ok).send(result.data);
}
