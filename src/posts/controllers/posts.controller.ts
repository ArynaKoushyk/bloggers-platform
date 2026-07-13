import { Request, Response } from "express";
import { GetPostListQueryHandler } from "../queries/get-posts-list.query-handler";
import { GetPostsByBlogIdQueryHandler } from "../queries/get-posts-by-blog-id.query-handler";
import { GetPostQueryHandler } from "../queries/get-post.query-handler";
import { IPostsService } from "../interfaces/posts.service-interface";
import { CreatePostByBlogIdInputDto } from "../dto/create-post-by-blog-id.input.dto";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../core/types/requests";
import { PostViewModel } from "../types/post-view-model";
import { APIErrorResult } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../core/types/http-statuses";
import { CreatePostInputDto } from "../dto/create-post.input.dto";
import { getPostQueryInput } from "../helpers/get-post-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { UpdatePostInputDto } from "../dto/update-post.input.dto";

export class PostsController {
  constructor(
    private postsService: IPostsService,
    private getPostQueryHandler: GetPostQueryHandler,
    private getPostListQueryHandler: GetPostListQueryHandler,
    private getPostsByBlogIdQueryHandler: GetPostsByBlogIdQueryHandler,
  ) {}

  async createPostByBlogIdHandler(
    req: RequestWithParamsAndBody<{ id: string }, CreatePostByBlogIdInputDto>,
    res: Response<PostViewModel | APIErrorResult>,
  ) {
    const createDto = req.body;
    const blogId = req.params.id;
    const createResult = await this.postsService.createPostByBlogId(blogId, createDto);
    if (createResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(createResult.status));
    }
    const postId = createResult.data;
    const createdPostResult = await this.getPostQueryHandler.findPostById(postId);
    if (createdPostResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdPostResult.status)).send({
        errorsMessages: createdPostResult.errorsMessages,
      });
    }

    res.status(HttpStatus.Created).send(createdPostResult.data);
  }
  async createPostHandler(
    req: RequestWithBody<CreatePostInputDto>,
    res: Response<PostViewModel | APIErrorResult>,
  ) {
    const createDto = req.body;
    const createResult = await this.postsService.createPost(createDto);
    if (createResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createResult.status)).send({
        errorsMessages: createResult.errorsMessages,
      });
    }
    const postId = createResult.data;
    const createdPostResult = await this.getPostQueryHandler.findPostById(postId);
    if (createdPostResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdPostResult.status)).send({
        errorsMessages: createdPostResult.errorsMessages,
      });
    }
    return res.status(HttpStatus.Created).send(createdPostResult.data);
  }

  async deletePostHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const postId = req.params.id;
    const result = await this.postsService.deletePost(postId);
    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  }

  async getPostListHandler(req: Request, res: Response<PaginatedViewModel<PostViewModel>>) {
    const query = getPostQueryInput(req);
    const result = await this.getPostListQueryHandler.findAllPosts(query);
    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async getPostHandler(req: Request<{ id: string }>, res: Response<PostViewModel>) {
    const id = req.params.id;
    const result = await this.getPostQueryHandler.findPostById(id);

    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async getPostsByBlogIdHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response<PaginatedViewModel<PostViewModel>>,
  ) {
    const blogId = req.params.id;
    const query = getPostQueryInput(req);
    const result = await this.getPostsByBlogIdQueryHandler.findPostsByBlogId(blogId, query);
    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }

    res.status(HttpStatus.Ok).send(result.data);
  }

  async updatePostHandler(
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostInputDto>,
    res: Response,
  ) {
    const postId = req.params.id;
    const result = await this.postsService.updatePost(postId, req.body);

    if (result.status === ResultStatus.BadRequest) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send({ errorsMessages: result.errorsMessages });
    }
    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  }
}
