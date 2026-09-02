import { Result } from "../../core/result/result.type";
import { CreateBlogInputDto } from "../dto/create-blog.input.dto";
import { UpdateBlogInputDto } from "../dto/update-blog.input.dto";
import { BlogDocument } from "../infrastructure/persistence/mongoose/blog.model";

export interface IBlogsService {
  findBlogById(id: string): Promise<Result<BlogDocument>>;
  createBlog(dto: CreateBlogInputDto): Promise<Result<string>>;
  updateBlog(id: string, dto: UpdateBlogInputDto): Promise<Result<null>>;
  deleteBlog(id: string): Promise<Result<null>>;
}
