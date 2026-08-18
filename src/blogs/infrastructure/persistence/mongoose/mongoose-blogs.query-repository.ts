import { WithId } from "mongodb";
import { injectable } from "inversify";
import { IBlogsQueryRepository } from "../../../interfaces/blogs.query.repository-interface";
import { BlogQueryInput } from "../../../types/blog-query.input";
import { BlogModel } from "./blog.model";
import { BlogDbType } from "../../../types/blog-db.type";
import { QueryFilter } from "mongoose";

@injectable()
export class MongoBlogsQueryRepository implements IBlogsQueryRepository {
  async findAllBlogs(
    query: BlogQueryInput,
  ): Promise<{ items: WithId<BlogDbType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: QueryFilter<BlogDbType> = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }
    const items = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean<WithId<BlogDbType>[]>()
      .exec();

    const totalCount = await BlogModel.countDocuments(filter).exec();
    return { items, totalCount };
  }

  async findBlogById(id: string): Promise<WithId<BlogDbType> | null> {
    return BlogModel.findById(id).lean<WithId<BlogDbType>>().exec();
  }
}
