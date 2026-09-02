import { LikeParentType } from "../like-parent.type";
import { LikeStatus } from "../like-status.type";

export type UpdateLikeStatusData = {
  parentId: string;
  parentType: LikeParentType;
  authorId: string;
  status: LikeStatus;
};
