import { WithId } from "mongodb";
import { PostDbType } from "../types/post-db.model";
import { PostQueryInput } from "../types/post-query.input";

export interface IPostsQueryRepository {
  findAllPosts(
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbType>[]; totalCount: number }>;

  findPostById(id: string): Promise<WithId<PostDbType> | null>;
  findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbType>[]; totalCount: number }>;
}
