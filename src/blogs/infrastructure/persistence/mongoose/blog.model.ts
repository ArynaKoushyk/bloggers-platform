import mongoose, { HydratedDocument, Model } from "mongoose";
import { BlogDbType } from "../../../types/blog-db.type";
import { CreateBlogData } from "../../../types/data/create-blog.data";
import { UpdateBlogData } from "../../../types/data/update-blog.data";
const { Schema, model } = mongoose;

export type BlogDocument = HydratedDocument<BlogDbType, BlogMethods>;

type BlogModelType = Model<BlogDbType, {}, BlogMethods> & BlogStatics;

type BlogStatics = typeof BlogEntity;
interface BlogMethods {
  updateBlog(data: UpdateBlogData): void;
}

class BlogEntity {
  private constructor() {}

  static createBlog(data: CreateBlogData): BlogDocument {
    const { name, description, websiteUrl } = data;

    const blog = new BlogModel();

    blog.name = name;
    blog.description = description;
    blog.websiteUrl = websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;

    return blog;
  }

  updateBlog(this: BlogDocument, data: UpdateBlogData): void {
    const { name, description, websiteUrl } = data;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}

const blogSchema = new Schema<BlogDbType, BlogModelType, BlogMethods, {}, {}, BlogStatics>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isMembership: { type: Boolean, default: false },
  },
  { optimisticConcurrency: true },
);

blogSchema.loadClass(BlogEntity);

export const BlogModel = model<BlogDbType, BlogModelType>("Blog", blogSchema, "blogs");
