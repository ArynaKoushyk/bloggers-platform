import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { PostQueryInput } from "../types/post-query.input";
import { PostDbModel } from "../types/post-db.model";

export const postsQueryRepository = {
  async findAllPosts(
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbModel>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: any = {};

    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findPostById(id: string): Promise<WithId<PostDbModel> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<{ items: WithId<PostDbModel>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter = { blogId };

    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);
    return { items, totalCount };
  },
};
