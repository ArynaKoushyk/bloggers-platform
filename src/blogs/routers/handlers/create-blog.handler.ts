import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogViewModel } from "../../types/blog-view-model";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../../core/result/result.type";
import { CreateBlogInputDto } from "../../dto/create-blog.input.dto";
import { blogsService } from "../../composition/blogs.container";
import { getBlogQueryHandler } from "../../queries/get-blog.query-handler";

export async function createBlogHandler(
  req: RequestWithBody<CreateBlogInputDto>,
  res: Response<BlogViewModel | APIErrorResult>,
) {
  const createDto = req.body;

  const createResult = await blogsService.createBlog(createDto);
  if (createResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createResult.status)).send({
      errorsMessages: createResult.errorsMessages,
    });
  }
  const blogId = createResult.data;
  const createdBlogResult = await getBlogQueryHandler.findBlogById(blogId);
  if (createdBlogResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createdBlogResult.status)).send({
      errorsMessages: createdBlogResult.errorsMessages,
    });
  }
  return res.status(HttpStatus.Created).send(createdBlogResult.data);
}
