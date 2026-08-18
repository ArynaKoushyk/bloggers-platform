import { injectable } from "inversify";
import { ICommentsRepository } from "../../../interfaces/comments.repository-interfaces";
import { CommentDocument, CommentModel } from "./comment.model";

@injectable()
export class MongoCommentsRepository implements ICommentsRepository {
  async findCommentById(id: string): Promise<CommentDocument | null> {
    return await CommentModel.findById(id).exec();
  }

  async save(comment: CommentDocument): Promise<void> {
   await  comment.save();
  }

  async deleteComment(id: string): Promise<boolean> {
    const deleteResult = await CommentModel.deleteOne({ _id: id }).exec();
    return deleteResult.deletedCount === 1;
  }
}
