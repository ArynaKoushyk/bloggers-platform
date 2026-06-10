import { CreateBlogData } from "../../types/data/create-blog.data";
import { UpdateBlogData } from "../../types/data/update-blog.data";
import { BlogEntity } from "../../types/domain/blog-entity.model";

export type BlogsRepository = {
  findBlogById(id: string): Promise<BlogEntity | null>;
  createBlog(data: CreateBlogData): Promise<string>;
  updateBlog(id: string, data: UpdateBlogData): Promise<boolean>;
  deleteBlog(id: string): Promise<boolean>;
};
