import { ObjectId } from "mongodb";
import { commentCollection } from "../../db/mongo.db";
import { CommentEntity } from "../types/domain/comment-entity.model";
import { mapCommentDbToEntity } from "../mappers/map-comment.db-to-entity.model";
import { CreateCommentData } from "../types/data/create-comment.data";
import { UpdateCommentData } from "../types/data/update-comment.data";
import { ICommentsRepository } from "../interfaces/comments.repository-interfaces";
import { injectable } from "inversify";

@injectable()
export class MongoCommentsRepository implements ICommentsRepository {
  async findCommentById(id: string): Promise<CommentEntity | null> {
    const document = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return null;
    }
    return mapCommentDbToEntity(document);
  }

  async createComment(data: CreateCommentData): Promise<string> {
    const insertResult = await commentCollection.insertOne(data);
    return insertResult.insertedId.toString();
  }

  async updateComment(id: string, data: UpdateCommentData): Promise<boolean> {
    const { content } = data;
    const updateResult = await commentCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          content,
        },
      },
    );

    return updateResult.matchedCount === 1;
  }

  async deleteComment(id: string): Promise<boolean> {
    const deleteResult = await commentCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
}
