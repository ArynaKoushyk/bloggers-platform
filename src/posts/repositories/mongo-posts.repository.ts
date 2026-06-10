import { ObjectId } from "mongodb";
import { postCollection } from "../../db/mongo.db";
import { PostEntity } from "../types/domain/post-entity.model";
import { mapPostDbToEntity } from "../mappers/map-post.db-to-entity.model";
import { CreatePostData } from "../types/data/create-post.data";
import { UpdatePostData } from "../types/data/update-post.data";
import { PostsRepository } from "../applications/types/posts.repository.type";

export const mongoPostsRepository: PostsRepository = {
  async findPostById(id: string): Promise<PostEntity | null> {
    const document = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return null;
    }
    return mapPostDbToEntity(document);
  },

  async createPost(data: CreatePostData): Promise<string> {
    const insertResult = await postCollection.insertOne(data);
    return insertResult.insertedId.toString();
  },

  async updatePost(id: string, data: UpdatePostData): Promise<boolean> {
    const { title, shortDescription, content, blogId, blogName } = data;
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

  async deletePostsByBlogId(blogId: string): Promise<void> {
    await postCollection.deleteMany({ blogId });
    return;
  },
};
