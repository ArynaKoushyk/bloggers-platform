import { Response } from "express";
import { BlogInputDto } from "../../dto/blog-input.dto";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogViewModel } from "../../types/blog-view-model";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../applications/blogs.service";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../../core/result/result.type";

export async function createBlogHandler(
  req: RequestWithBody<BlogInputDto>,
  res: Response<BlogViewModel | APIErrorResult>,
) {
  const newBlog = req.body;
  const result = await blogsService.createBlog(newBlog);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }
  const blogViewModel = mapToBlogViewModel(result.data);
  return res.status(HttpStatus.Created).send(blogViewModel);
}
