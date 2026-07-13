import { CreateCommentData } from "../types/data/create-comment.data";
import { UpdateCommentData } from "../types/data/update-comment.data";
import { CommentEntity } from "../types/domain/comment-entity.model";

export interface ICommentsRepository {
  findCommentById(id: string): Promise<CommentEntity | null>;
  createComment(data: CreateCommentData): Promise<string>;
  updateComment(id: string, data: UpdateCommentData): Promise<boolean>;
  deleteComment(id: string): Promise<boolean>;
}
