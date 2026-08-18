import { WithId } from "mongodb";
import { CommentDbType } from "../types/comment-db.model";
import { CommentViewModel } from "../types/comment-view-model";

export function mapToCommentViewModel(comment: WithId<CommentDbType>): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt.toString(),
  };
}
