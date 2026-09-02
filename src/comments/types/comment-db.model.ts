import { CommentatorInfo } from "./commentator-info.type";

export type CommentDbType = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date;
};
