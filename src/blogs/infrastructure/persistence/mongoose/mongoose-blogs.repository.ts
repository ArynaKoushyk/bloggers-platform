import { injectable } from "inversify";
import { IBlogsRepository } from "../../../interfaces/blogs.repository-interface";
import { BlogDocument, BlogModel } from "./blog.model";

@injectable()
export class MongoBlogsRepository implements IBlogsRepository {
  async findBlogById(id: string): Promise<BlogDocument | null> {
    return await BlogModel.findById(id);
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async deleteBlog(id: string): Promise<boolean> {
    const deleteResult = await BlogModel.deleteOne({ _id: id });
    return deleteResult.deletedCount === 1;
  }
}
