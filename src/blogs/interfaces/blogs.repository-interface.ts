import { BlogDocument } from "../infrastructure/persistence/mongoose/blog.model";

export interface IBlogsRepository {
  findBlogById(id: string): Promise<BlogDocument | null>;
  save(blog: BlogDocument): Promise<void>;
  deleteBlog(id: string): Promise<boolean>;
}
