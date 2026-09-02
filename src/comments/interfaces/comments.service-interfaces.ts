import { AuthUserType } from "../../auth/types/auth-user.type";
import { Result } from "../../core/result/result.type";
import { CreateCommentInputDto } from "../dto/create-comment.input.dto";
import { UpdateCommentInputDto } from "../dto/update-comment.input.dto";
import { CommentDocument } from "../infrastructure/persistence/mongoose/comment.model";

export interface ICommentsService {
  findCommentById(id: string): Promise<Result<CommentDocument>>;
  createComment(
    postId: string,
    dto: CreateCommentInputDto,
    user: AuthUserType,
  ): Promise<Result<string>>;
  updateComment(
    commentId: string,
    dto: UpdateCommentInputDto,
    userId: string,
  ): Promise<Result<null>>;
  deleteComment(commentId: string, userId: string): Promise<Result<null>>;
}
