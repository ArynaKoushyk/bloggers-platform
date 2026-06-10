import { WithId } from "mongodb";
import { PostDbModel } from "../types/post-db.model";
import { PostEntity } from "../types/domain/post-entity.model";

export function mapPostDbToEntity(post: WithId<PostDbModel>): PostEntity {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
}
