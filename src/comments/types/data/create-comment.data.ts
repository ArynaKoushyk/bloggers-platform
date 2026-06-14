import { CommentatorInfo } from "../commentator-info.type";

export type CreateCommentData = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
