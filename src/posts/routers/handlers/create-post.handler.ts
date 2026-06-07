import { Request, Response } from "express";
import { PostInputDto } from "../../dto/post-input.dto";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { createErrorMessages } from "../../../core/utils/error.utils";
import { postsRepository } from "../../repositories/posts.repository";
import { Post } from "../../types/domain/post.type";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { postsService } from "../../applications/posts.service";
import { RequestWithBody } from "../../../core/types/requests";
import { PostViewModel } from "../../types/post-view-model";
import { APIErrorResult } from "../../../core/result/result.type";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";

export async function createPostHandler(
  req: RequestWithBody<PostInputDto>,
  res: Response<PostViewModel | APIErrorResult>,
) {
  const newPost = req.body;
  const result = await postsService.createPost(newPost);
  if (result.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(result.status)).send({
      errorsMessages: result.errorsMessages,
    });
  }
  const postViewModel = mapToPostViewModel(result.data);
  return res.status(HttpStatus.Created).send(postViewModel);
}
