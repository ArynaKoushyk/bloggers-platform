import { ExtendedLikesInfo } from "../../likes/types/extended-likes-info-view-model";

export type PostViewModel = {
  id: string;
  blogName: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  extendedLikesInfo: ExtendedLikesInfo;
  createdAt: string;
};
