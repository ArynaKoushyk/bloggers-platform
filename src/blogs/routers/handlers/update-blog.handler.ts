import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogInputDto } from "../../dto/blog-input.dto";
import { blogsService } from "../../applications/blogs.service";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, BlogInputDto>,
  res: Response,
) {
  const id = req.params.id;
  const result = await blogsService.updateBlog(id, req.body);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
//ошибки валидации
// ошибка 404 если блога нет
// проверяю result и формируем здесь статус ответ
