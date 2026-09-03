import { LikeParentType } from "./like-parent.type";
import { StoredLikeStatus } from "./like-status.type";

export type LikeDbType = {
  parentId: string;
  parentType: LikeParentType;
  authorId: string;
  authorLogin: string;
  status: StoredLikeStatus;
  createdAt: Date;
  updatedAt: Date;
};
