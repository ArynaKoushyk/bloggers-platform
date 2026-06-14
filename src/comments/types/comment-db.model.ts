import { CommentatorInfo } from "./commentator-info.type";

export type CommentDbModel = {
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: string;
};
