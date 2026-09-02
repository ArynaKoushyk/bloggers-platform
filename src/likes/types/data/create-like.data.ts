import { LikeParentType } from "../like-parent.type";
import { StoredLikeStatus } from "../like-status.type";

export type CreateLikeData = {
  parentId: string;
  parentType: LikeParentType;
  authorId: string;
  status: StoredLikeStatus;
};
