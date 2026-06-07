import { WithId } from "mongodb";
import { BlogInputDto } from "../dto/blog-input.dto";
import { blogsRepository } from "../repositories/blogs.repository";
import { Blog } from "../types/domain/blogs.type";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { BlogQueryInput } from "../types/blog-query.input";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";

export const blogsService = {
  async findAllBlogs(query: BlogQueryInput): Promise<Result<PaginatedViewModel<WithId<Blog>>>> {
    const { items, totalCount } = await blogsRepository.findAllBlogs(query);
    return {
      status: ResultStatus.Success,
      data: {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items,
      },
      errorsMessages: null,
    };
  },

  async findBlogById(id: string): Promise<Result<WithId<Blog>>> {
    const blog = await blogsRepository.findBlogById(id);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: blog,
      errorsMessages: null,
    };
  },

  async createBlog(dto: BlogInputDto): Promise<Result<WithId<Blog>>> {
    const { name, description, websiteUrl } = dto;
    const newBlog: Blog = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const createdBlog = await blogsRepository.createBlog(newBlog);
    return {
      status: ResultStatus.Success,
      data: createdBlog,
      errorsMessages: null,
    };
  },

  //!!
  async updateBlog(id: string, dto: BlogInputDto): Promise<Result<null>> {
    //формирую обьект object result и возвращается в одном и том же виде
    // и в заивисимости от того какое состояние приходит в хендлер возаращю либо положительно либо отрицталеьн
    // например isSuccess true false

    const isUpdated = await blogsRepository.updateBlog(id, dto);
    if (!isUpdated) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  },

  async deleteBlog(id: string): Promise<Result<null>> {
    const isDeleted = await blogsRepository.deleteBlog(id);
    if (!isDeleted) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  },
};
