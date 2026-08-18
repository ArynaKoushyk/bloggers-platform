import { WithId } from "mongodb";
import { BlogQueryInput } from "../types/blog-query.input";
import { BlogDbType } from "../types/blog-db.type";

export interface IBlogsQueryRepository {
  findAllBlogs(
    query: BlogQueryInput,
  ): Promise<{ items: WithId<BlogDbType>[]; totalCount: number }>;

  findBlogById(id: string): Promise<WithId<BlogDbType> | null>;
}
