import { WithId } from "mongodb";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentDbModel } from "../types/comment-db.model";

export interface ICommentsQueryRepository {
  findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
  ): Promise<{ items: WithId<CommentDbModel>[]; totalCount: number }>;

  findCommentById(id: string): Promise<WithId<CommentDbModel> | null>;
}
