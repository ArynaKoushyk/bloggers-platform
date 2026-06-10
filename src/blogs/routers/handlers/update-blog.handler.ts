import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { UpdateBlogInputDto } from "../../dto/update-blog.input.dto";
import { blogsService } from "../../composition/blogs.container";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<{ id: string }, UpdateBlogInputDto>,
  res: Response,
) {
  const updateDto = req.body;
  const blogId = req.params.id;
  const updateResult = await blogsService.updateBlog(blogId, updateDto);
  if (updateResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(updateResult.status));
  }
  return res.sendStatus(HttpStatus.NoContent);
}
//ошибки валидации
// ошибка 404 если блога нет
// проверяю result и формируем здесь статус ответ
