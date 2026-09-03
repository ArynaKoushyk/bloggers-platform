import { WithId } from "mongodb";
import { CommentDbType } from "../types/comment-db.model";
import { CommentViewModel } from "../types/comment-view-model";
import { LikeStatus } from "../../likes/types/like-status.type";

export function mapToCommentViewModel(
  comment: WithId<CommentDbType>,
  myStatus: LikeStatus,
): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    likesInfo: {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus: myStatus,
    },
    createdAt: comment.createdAt.toISOString(),
  };
}

