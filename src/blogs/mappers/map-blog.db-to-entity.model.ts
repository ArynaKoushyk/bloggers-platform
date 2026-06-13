import { WithId } from "mongodb";
import { BlogDbModel } from "../types/blog-db.model";
import { BlogEntity } from "../types/domain/blog-entity.model";

export function mapBlogDbToEntity(blog: WithId<BlogDbModel>): BlogEntity {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  }; 
}

