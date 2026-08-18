import { CommentDocument } from "../infrastructure/persistence/mongoose/comment.model";

export interface ICommentsRepository {
  findCommentById(id: string): Promise<CommentDocument | null>;
  save(comment: CommentDocument): Promise<void>;
  deleteComment(id: string): Promise<boolean>;
}
