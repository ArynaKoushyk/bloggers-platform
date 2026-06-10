import { Result } from "../../../core/result/result.type";
import { CreateBlogInputDto } from "../../dto/create-blog.input.dto";
import { UpdateBlogInputDto } from "../../dto/update-blog.input.dto";
import { BlogEntity } from "../../types/domain/blog-entity.model";

export type BlogsService = {
  findBlogById(id: string): Promise<Result<BlogEntity>>;
  createBlog(dto: CreateBlogInputDto): Promise<Result<string>>;
  updateBlog(id: string, dto: UpdateBlogInputDto): Promise<Result<null>>;
  deleteBlog(id: string): Promise<Result<null>>;
};
