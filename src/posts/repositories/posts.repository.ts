import { Post } from "../types/post.type";
import { PostInputDto } from "../dto/post-input.dto";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/mongo.db";

export const postsRepository = {
  async findAllPosts(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findPostById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async createPost(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: new ObjectId(insertResult.insertedId) };
  },

  async updatePost(id: string, dto: PostInputDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );
    if (updateResult.matchedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async deletePost(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new Error("Post not exist");
    }
    return;
  },

  async deletePostByBlogId(blogId: string): Promise<void> {
    await postCollection.deleteMany({ blogId: blogId });
  },
};
