import { Post } from "../types/domain/post.type";
import { ObjectId, WithId } from "mongodb";
import { blogCollection, postCollection } from "../../db/mongo.db";
import { PostQueryInput } from "../types/post-query.input";

export const postsRepository = {
  async findAllPosts(
    query: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
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

  async findPostById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async findPostsByBlogId(
    blogId: string,
    query: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
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

  async createPost(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async updatePost(id: string, post: Partial<Post>): Promise<boolean> {
    const { title, shortDescription, content, blogId, blogName } = post;
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title,
          shortDescription,
          content,
          blogId,
          blogName,
        },
      },
    );
    return updateResult.matchedCount === 1;
  },

  //!!выбрасывать ли ошибки в репо
  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },

  async deletePostByBlogId(blogId: string): Promise<void> {
    await postCollection.deleteMany({ blogId });
    return;
  },
};
