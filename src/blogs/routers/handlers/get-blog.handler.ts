import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { blogsService } from "../../applications/blogs.service";
import { RequestWithParams } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function getBlogHandler(req: RequestWithParams<{ id: string }>, res: Response) {
  const id = req.params.id;
  const result = await blogsService.findBlogById(id);

  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  const blogViewModel = mapToBlogViewModel(result.data);
  return res.status(HttpStatus.Ok).send(blogViewModel);
}
