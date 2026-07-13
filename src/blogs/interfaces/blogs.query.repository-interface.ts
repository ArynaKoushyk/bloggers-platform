import { WithId } from "mongodb";
import { BlogQueryInput } from "../types/blog-query.input";
import { BlogDbModel } from "../types/blog-db.model";


export interface IBlogsQueryRepository {
  findAllBlogs(
    query: BlogQueryInput,
  ): Promise<{ items: WithId<BlogDbModel>[]; totalCount: number }>;

  findBlogById(id: string): Promise<WithId<BlogDbModel> | null>;
}
