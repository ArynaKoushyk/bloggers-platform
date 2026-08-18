import { WithId } from "mongodb";
import { injectable } from "inversify";
import { IPostsQueryRepository } from "../../../interfaces/posts.query.repository-interface";
import { PostQueryInput } from "../../../types/post-query.input";
import { PostModel } from "./post.model";
import { QueryFilter } from "mongoose";
import { BlogDbType } from "../../../../blogs/types/blog-db.type";
import { PostDbType } from "../../../types/post-db.model";

@injectable()
export class MongoPostsQueryRepository implements IPostsQueryRepository {
  async findAllPosts(
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: QueryFilter<BlogDbType> = {};

    const items = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean<WithId<PostDbType>[]>()
      .exec();

    const totalCount = await PostModel.countDocuments(filter);
    return { items, totalCount };
  }

  async findPostById(id: string): Promise<WithId<PostDbType> | null> {
    return PostModel.findById(id);
  }

  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: QueryFilter<BlogDbType>  = { blogId };

    const items = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean<WithId<PostDbType>[]>()
      .exec();

    const totalCount = await PostModel.countDocuments(filter);
    return { items, totalCount };
  }
}
