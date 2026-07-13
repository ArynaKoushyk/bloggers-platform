import { WithId } from "mongodb";
import { PostDbModel } from "../types/post-db.model";
import { PostQueryInput } from "../types/post-query.input";

export interface IPostsQueryRepository {
  findAllPosts(
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbModel>[]; totalCount: number }>;

  findPostById(id: string): Promise<WithId<PostDbModel> | null>;
  findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbModel>[]; totalCount: number }>;
}
