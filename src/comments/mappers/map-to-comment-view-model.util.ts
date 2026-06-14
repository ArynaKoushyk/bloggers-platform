import { WithId } from "mongodb";
import { CommentDbModel } from "../types/comment-db.model";
import { CommentViewModel } from "../types/comment-view-model";

export function mapToCommentViewModel(comment: WithId<CommentDbModel>): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt,
  };
}
