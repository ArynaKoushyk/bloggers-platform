import { WithId } from "mongodb";
import { CommentDbModel } from "../types/comment-db.model";
import { CommentEntity } from "../types/domain/comment-entity.model";

export function mapCommentDbToEntity(comment: WithId<CommentDbModel>): CommentEntity {
  return {
    id: comment._id.toString(),
    postId: comment.postId,
    commentatorInfo: comment.commentatorInfo,
    content: comment.content,
    createdAt: comment.createdAt,
  };
}
