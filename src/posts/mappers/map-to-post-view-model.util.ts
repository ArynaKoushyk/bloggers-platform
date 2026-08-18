import { WithId } from "mongodb";
import { PostViewModel } from "../types/post-view-model";
import { PostDbType } from "../types/post-db.model";

export function mapToPostViewModel(post: WithId<PostDbType>): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
  };
}
