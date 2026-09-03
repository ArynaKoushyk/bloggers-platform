import { WithId } from "mongodb";
import { PostViewModel } from "../types/post-view-model";
import { PostDbType } from "../types/post-db.model";
import { LikeStatus } from "../../likes/types/like-status.type";
import { LikeDetailsViewModel } from "../../likes/types/like-details-view-model";

export function mapToPostViewModel(
  post: WithId<PostDbType>,
  myStatus: LikeStatus,
  newestLikes: LikeDetailsViewModel[],
): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    extendedLikesInfo: {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: myStatus,
      newestLikes: newestLikes,
    },
    createdAt: post.createdAt.toISOString(),
  };
}
