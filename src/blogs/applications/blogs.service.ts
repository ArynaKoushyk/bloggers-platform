import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IBlogsRepository } from "../interfaces/blogs.repository-interface";
import { BlogEntity } from "../types/domain/blog-entity.model";
import { CreateBlogData } from "../types/data/create-blog.data";
import { UpdateBlogData } from "../types/data/update-blog.data";
import { CreateBlogInputDto } from "../dto/create-blog.input.dto";
import { UpdateBlogInputDto } from "../dto/update-blog.input.dto";
import { MongoBlogsRepository } from "../repositories/mongo-blogs.repository";
import { IBlogsService } from "../interfaces/blogs.service-interface";

export class BlogsService implements IBlogsService {
  // private blogsRepository: IBlogsRepository;
  // constructor(blogsRepository: IBlogsRepository) {
  //   this.blogsRepository = blogsRepository;
  // }

  constructor(private blogsRepository: IBlogsRepository) {}
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
    const { name, description, websiteUrl } = dto;
    const createData: CreateBlogData = {
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    const blogId = await this.blogsRepository.createBlog(createData);

    return {
      status: ResultStatus.Success,
      data: blogId,
      errorsMessages: null,
    };
  }

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

    const isUpdated = await this.blogsRepository.updateBlog(id, updateData);
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
