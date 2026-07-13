import { ObjectId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { BlogEntity } from "../types/domain/blog-entity.model";
import { CreateBlogData } from "../types/data/create-blog.data";
import { UpdateBlogData } from "../types/data/update-blog.data";
import { mapBlogDbToEntity } from "../mappers/map-blog.db-to-entity.model";
import { IBlogsRepository } from "../interfaces/blogs.repository-interface";

//!!solid - dipendency inversion(injection), inversion of control
export class MongoBlogsRepository implements IBlogsRepository {
  async findBlogById(id: string): Promise<BlogEntity | null> {
    const document = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return null;
    }
    return mapBlogDbToEntity(document);
  }

  async createBlog(data: CreateBlogData): Promise<string> {
    const insertResult = await blogCollection.insertOne(data);
    return insertResult.insertedId.toString();
  }

  async updateBlog(id: string, data: UpdateBlogData): Promise<boolean> {
    const { name, description, websiteUrl } = data;
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
  }

  async deleteBlog(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
