import { ObjectId, WithId } from "mongodb";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentDbModel } from "../types/comment-db.model";
import { commentCollection } from "../../db/mongo.db";
import { ICommentsQueryRepository } from "../interfaces/comments.query.repository-interface";

export class MongoCommentsQueryRepository implements ICommentsQueryRepository {
  async findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
  ): Promise<{ items: WithId<CommentDbModel>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter = { postId };

    const items = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);
    return { items, totalCount };
  }

  async findCommentById(id: string): Promise<WithId<CommentDbModel> | null> {
    return commentCollection.findOne({ _id: new ObjectId(id) });
  }
}
