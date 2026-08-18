import { WithId } from "mongodb";
import { BlogViewModel } from "../types/blog-view-model";
import { BlogDbType } from "../types/blog-db.type";

export function mapToBlogViewModel(blog: WithId<BlogDbType>): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
}
