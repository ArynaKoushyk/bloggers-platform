import { LikesInfo } from "../../likes/types/likes-info.type";
import { CommentatorInfo } from "./commentator-info.type";

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfo;
  likesInfo: LikesInfo;
  createdAt: string;
};
