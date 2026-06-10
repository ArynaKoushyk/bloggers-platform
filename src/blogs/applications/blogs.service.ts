import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { BlogsRepository } from "./types/blogs.repository.type";
import { BlogEntity } from "../types/domain/blog-entity.model";
import { CreateBlogData } from "../types/data/create-blog.data";
import { UpdateBlogData } from "../types/data/update-blog.data";
import { CreateBlogInputDto } from "../dto/create-blog.input.dto";
import { BlogsService } from "./types/blogs.service.type";
import { UpdateBlogInputDto } from '../dto/update-blog.input.dto';

export const createBlogsService = (blogsRepository: BlogsRepository): BlogsService => {
  return {
    async findBlogById(id: string): Promise<Result<BlogEntity>> {
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

    async createBlog(dto: CreateBlogInputDto): Promise<Result<string>> {
      const { name, description, websiteUrl } = dto;
      const createData: CreateBlogData = {
        name,
        description,
        websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false,
      };

      const blogId = await blogsRepository.createBlog(createData);

      return {
        status: ResultStatus.Success,
        data: blogId,
        errorsMessages: null,
      };
    },

    //!!
    async updateBlog(id: string, dto: UpdateBlogInputDto): Promise<Result<null>> {
      //формирую обьект object result и возвращается в одном и том же виде
      // и в заивисимости от того какое состояние приходит в хендлер возаращю либо положительно либо отрицталеьн
      // например isSuccess true false

      const { name, description, websiteUrl } = dto;
      const updateData: UpdateBlogData = {
        name,
        description,
        websiteUrl,
      };

      const isUpdated = await blogsRepository.updateBlog(id, updateData);
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
};
