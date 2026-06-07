import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../applications/blogs.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { BlogQueryInput } from "../../types/blog-query.input";
import { mapToPaginatedBlogViewModel } from "../mappers/map-to-blog-paginated-model.util";
import { getBlogQueryInput } from "../../helpers/get-blog-query.input";

export async function getBlogListHandler(req: Request, res: Response) {
  const query = getBlogQueryInput(req);
  const result = await blogsService.findAllBlogs(query);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  const blogViewModels = result.data.items.map((blog) => mapToBlogViewModel(blog));
  return res.status(HttpStatus.Ok).send(mapToPaginatedBlogViewModel(result.data));
}
