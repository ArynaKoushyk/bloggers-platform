import { WithId } from "mongodb";
import { Post } from "../types/post.type";
import { PostViewModel } from "../types/post-view-model";

export function mapToPostViewModel(
  post: WithId<Post>,
  blogName: string,
): PostViewModel {
  return {
    id: post._id.toString(),
    blogName: blogName,
    createdAt: post.createdAt,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
  };
}
