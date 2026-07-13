import { Request, Response } from "express";
import { APIErrorResult } from "../../core/result/result.type";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../core/types/requests";
import { IBlogsService } from "../interfaces/blogs.service-interface";
import { CreateBlogInputDto } from "../dto/create-blog.input.dto";
import { BlogViewModel } from "../types/blog-view-model";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { HttpStatus } from "../../core/types/http-statuses";
import { getBlogQueryInput } from "../helpers/get-blog-query.input";
import { UpdateBlogInputDto } from "../dto/update-blog.input.dto";
import { GetBlogsListQueryHandler } from "../queries/get-blogs-list.query-handler";
import { GetBlogQueryHandler } from "../queries/get-blog.query-handler";
import { DeleteBlogWithPostsUseCase } from "../use-cases/delete-blog-with-posts.use-case";

export class BlogsController {
  constructor(
    private blogsService: IBlogsService,
    private getBlogsQueryHandler: GetBlogQueryHandler,
    private getBlogsListQueryHandler: GetBlogsListQueryHandler,
    private deleteBlogWithPostsUseCase: DeleteBlogWithPostsUseCase,
  ) {}

  async createBlogHandler(
    req: RequestWithBody<CreateBlogInputDto>,
    res: Response<BlogViewModel | APIErrorResult>,
  ) {
    const createDto = req.body;

    const createResult = await this.blogsService.createBlog(createDto);
    if (createResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createResult.status)).send({
        errorsMessages: createResult.errorsMessages,
      });
    }
    const blogId = createResult.data;
    const createdBlogResult = await this.getBlogsQueryHandler.findBlogById(blogId);
    if (createdBlogResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdBlogResult.status)).send({
        errorsMessages: createdBlogResult.errorsMessages,
      });
    }
    return res.status(HttpStatus.Created).send(createdBlogResult.data);
  }

  async deleteBlogHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const blogId = req.params.id;
    const deleteResult = await this.deleteBlogWithPostsUseCase.execute(blogId);
    if (deleteResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(deleteResult.status));
    } else {
      return res.sendStatus(HttpStatus.NoContent);
    }
  }

  async getBlogListHandler(req: Request, res: Response) {
    const query = getBlogQueryInput(req);
    const result = await this.getBlogsListQueryHandler.findAllBlogs(query);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async getBlogHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response<BlogViewModel | APIErrorResult>,
  ) {
    const id = req.params.id;
    const result = await this.getBlogsQueryHandler.findBlogById(id);

    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async updateBlogHandler(
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogInputDto>,
    res: Response,
  ) {
    const updateDto = req.body;
    const blogId = req.params.id;
    const updateResult = await this.blogsService.updateBlog(blogId, updateDto);
    if (updateResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(updateResult.status));
    }
    return res.sendStatus(HttpStatus.NoContent);
  }
}
