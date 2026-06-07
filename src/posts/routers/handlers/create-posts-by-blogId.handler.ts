import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postsService } from "../../applications/posts.service";
import { mapToPostViewModel } from "../../mappers/map-to-post-view-model.util";
import { PostInputDto } from "../../dto/post-input.dto";
import { PostViewModel } from "../../types/post-view-model";
import { RequestWithParamsAndBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../../core/result/result.type";

type CreatePostByBlogIdBody = Omit<PostInputDto, "blogId">;

export async function createPostByBlogIdHandler(
  req: RequestWithParamsAndBody<{ id: string }, CreatePostByBlogIdBody>,
  res: Response<PostViewModel | APIErrorResult>,
) {
  const newPost = req.body;
  const blogId = req.params.id;
  const result = await postsService.createPostByBlogId(blogId, newPost);
  if (result.status !== ResultStatus.Success) {
    return res.sendStatus(resultCodeToHttpException(result.status));
  }
  const postViewModel = mapToPostViewModel(result.data);
  res.status(HttpStatus.Created).send(postViewModel);
}
