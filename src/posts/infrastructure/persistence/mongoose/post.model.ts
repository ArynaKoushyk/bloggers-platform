import mongoose, { Model } from "mongoose";
import { PostDbType } from "../../../types/post-db.model";
import { CreatePostData } from "../../../types/data/create-post.data";
import { UpdatePostData } from "../../../types/data/update-post.data";
import { HydratedDocument } from "mongoose";
const { Schema, model } = mongoose;

export type PostDocument = HydratedDocument<PostDbType, PostMethods>;

type PostModelType = Model<PostDbType, {}, PostMethods> & PostStatics;

type PostStatics = typeof PostEntity;
interface PostMethods {
  updatePost(data: UpdatePostData): void;
}

class PostEntity {
  private constructor() {}

  static createPost(data: CreatePostData): PostDocument {
    const { title, shortDescription, content, blogId, blogName } = data;
    const post = new PostModel();
    post.title = title;
    post.shortDescription = shortDescription;
    post.content = content;
    post.blogId = blogId;
    post.blogName = blogName;
    post.createdAt = new Date();

    return post;
  }

  updatePost(this: PostDocument, data: UpdatePostData): void {
    const { title, shortDescription, content, blogId, blogName } = data;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogName = blogName;
    this.blogId = blogId;
  }
}

const postSchema = new Schema<PostDbType, PostModelType, PostMethods, {}, {}, PostStatics>(
  {
    title: { type: String, required: true, minLength: 1, maxLength: 250 },
    shortDescription: { type: String, required: true, maxLength: 500 },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true, minLength: 1, maxLength: 250 },
    createdAt: { type: Date, default: Date.now },
  },
  { optimisticConcurrency: true },
);

postSchema.loadClass(PostEntity);

export const PostModel = model<PostDbType, PostModelType>("Post", postSchema, "posts");
