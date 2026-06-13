import { WithId } from "mongodb";
import { BlogViewModel } from "../types/blog-view-model";
import { BlogDbModel } from "../types/blog-db.model";

export function mapToBlogViewModel(blog: WithId<BlogDbModel>): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
  
}
