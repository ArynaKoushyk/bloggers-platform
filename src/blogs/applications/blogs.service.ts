import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IBlogsRepository } from "../interfaces/blogs.repository-interface";
import { BlogEntity } from "../types/domain/blog-entity.model";
import { CreateBlogInputDto } from "../dto/create-blog.input.dto";
import { UpdateBlogInputDto } from "../dto/update-blog.input.dto";
import { IBlogsService } from "../interfaces/blogs.service-interface";
import { inject, injectable } from "inversify";
import { BLOGS_REPOSITORY } from "../../core/composition/di-tokens";
import { BlogModel } from "../infrastructure/persistence/mongoose/blog.model";
@injectable()
export class BlogsService implements IBlogsService {
  constructor(@inject(BLOGS_REPOSITORY) private blogsRepository: IBlogsRepository) {}
  async findBlogById(id: string): Promise<Result<BlogEntity>> {
    const blog = await this.blogsRepository.findBlogById(id);
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
  }

  async createBlog(dto: CreateBlogInputDto): Promise<Result<string>> {
    const createdBlog = BlogModel.createBlog(dto);
    await this.blogsRepository.save(createdBlog);
    return {
      status: ResultStatus.Success,
      data: createdBlog._id.toString(),
      errorsMessages: null,
    };
  }
  async updateBlog(id: string, dto: UpdateBlogInputDto): Promise<Result<null>> {
    const blog = await this.blogsRepository.findBlogById(id);
    if (!blog) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    blog.updateBlog(dto);
    await this.blogsRepository.save(blog);

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async deleteBlog(id: string): Promise<Result<null>> {
    const isDeleted = await this.blogsRepository.deleteBlog(id);
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
  }
}
