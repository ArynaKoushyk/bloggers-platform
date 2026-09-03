import { LikeDetailsViewModel } from "./like-details-view-model";
import { LikeStatus } from "./like-status.type";

export type ExtendedLikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: LikeDetailsViewModel[];
};
