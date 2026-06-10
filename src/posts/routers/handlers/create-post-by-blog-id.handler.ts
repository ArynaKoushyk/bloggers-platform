import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostViewModel } from "../../types/post-view-model";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../../core/result/result.type";
import { CreatePostByBlogIdInputDto } from "../../dto/create-post-by-blog-id.input.dto";
import { postsService } from "../../composition/posts.container";
import { getPostQueryHandler } from "../../queries/get-post.query-handler";

export async function createPostByBlogIdHandler(
  req: RequestWithParamsAndBody<{ id: string }, CreatePostByBlogIdInputDto>,
  res: Response<PostViewModel | APIErrorResult>,
) {
  const createDto = req.body;
  const blogId = req.params.id;
  const createResult = await postsService.createPostByBlogId(blogId, createDto);
  if (createResult.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(createResult.status));
  }
  const postId = createResult.data;
  const createdPostResult = await getPostQueryHandler.findPostById(postId);
  if (createdPostResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createdPostResult.status)).send({
      errorsMessages: createdPostResult.errorsMessages,
    });
  }

  res.status(HttpStatus.Created).send(createdPostResult.data);
}
