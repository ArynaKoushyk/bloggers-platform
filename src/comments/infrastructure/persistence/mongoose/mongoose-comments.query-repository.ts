import { WithId } from "mongodb";
import { injectable } from "inversify";
import { ICommentsQueryRepository } from "../../../interfaces/comments.query.repository-interface";
import { CommentQueryInput } from "../../../types/comment-query.input";
import { CommentModel } from "./comment.model";
import { CommentDbType } from "../../../types/comment-db.model";
import { QueryFilter } from "mongoose";

@injectable()
export class MongoCommentsQueryRepository implements ICommentsQueryRepository {
  async findCommentsByPostId(
    postId: string,
    query: CommentQueryInput,
  ): Promise<{ items: WithId<CommentDbType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: QueryFilter<CommentDbType> = { postId };

    const items = await CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean<WithId<CommentDbType>[]>()
      .exec();

    const totalCount = await CommentModel.countDocuments(filter).exec();
    return { items, totalCount };
  }

  async findCommentById(id: string): Promise<WithId<CommentDbType> | null> {
    return CommentModel.findById(id).lean<WithId<CommentDbType>>().exec();
  }
}
