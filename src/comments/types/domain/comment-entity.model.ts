import { CommentatorInfo } from "../commentator-info.type";

export type CommentEntity = {
  id: string;
  postId: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  createdAt: Date;
};
