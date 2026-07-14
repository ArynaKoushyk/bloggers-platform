import { ObjectId, WithId } from "mongodb";
import { BlogQueryInput } from "../types/blog-query.input";
import { blogCollection } from "../../db/mongo.db";
import { BlogDbModel } from "../types/blog-db.model";
import { IBlogsQueryRepository } from "../interfaces/blogs.query.repository-interface";




//!! лучше через интерфейсы или абсрактные классы

export class MongoBlogsQueryRepository implements IBlogsQueryRepository {
  async findAllBlogs(
    query: BlogQueryInput,
  ): Promise<{ items: WithId<BlogDbModel>[]; totalCount: number }> {
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
  }

  async findBlogById(id: string): Promise<WithId<BlogDbModel> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  }
}
