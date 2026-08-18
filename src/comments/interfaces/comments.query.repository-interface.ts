import { WithId } from "mongodb";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentDbType } from "../types/comment-db.model";

export interface ICommentsQueryRepository {
  findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
  ): Promise<{ items: WithId<CommentDbType>[]; totalCount: number }>;

  findCommentById(id: string): Promise<WithId<CommentDbType> | null>;
}
