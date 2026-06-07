import { ObjectId, WithId } from "mongodb";
import { Blog } from "../types/domain/blogs.type";
import { blogCollection } from "../../db/mongo.db";
import { BlogQueryInput } from "../types/blog-query.input";

export const blogsRepository = {
  async findAllBlogs(
    query: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findBlogById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async createBlog(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },

  async updateBlog(id: string, blog: Partial<Blog>): Promise<boolean> {
    const { name, description, websiteUrl } = blog;
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name,
          description,
          websiteUrl,
        },
      },
    );

    return updateResult.matchedCount === 1;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
