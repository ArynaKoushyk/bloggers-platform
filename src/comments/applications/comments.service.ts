import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { CreateCommentInputDto } from "../dto/create-comment.input.dto";
import { AuthUserType } from "../../auth/types/auth-user.type";
import { CreateCommentData } from "../types/data/create-comment.data";
import { UpdateCommentInputDto } from "../dto/update-comment.input.dto";
import { ICommentsRepository } from "../interfaces/comments.repository-interfaces";
import { ICommentsService } from "../interfaces/comments.service-interfaces";
import { IPostsRepository } from "../../posts/interfaces/posts.repository-interface";
import { inject, injectable } from "inversify";
import { COMMENTS_REPOSITORY, POSTS_REPOSITORY } from "../../core/composition/di-tokens";
import {
  CommentDocument,
  CommentModel,
} from "../infrastructure/persistence/mongoose/comment.model";

@injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @inject(COMMENTS_REPOSITORY) private commentsRepository: ICommentsRepository,
    @inject(POSTS_REPOSITORY) private postsRepository: IPostsRepository,
  ) {}
  async findCommentById(id: string): Promise<Result<CommentDocument>> {
    const comment = await this.commentsRepository.findCommentById(id);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: comment,
      errorsMessages: null,
    };
  }

  async createComment(
    postId: string,
    dto: CreateCommentInputDto,
    user: AuthUserType,
  ): Promise<Result<string>> {
    const { content } = dto;

    const post = await this.postsRepository.findPostById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const createData: CreateCommentData = {
      postId,
      content,
      commentatorInfo: {
        userId: user.id,
        userLogin: user.login,
      },
    };
    const createdComment = CommentModel.createComment(createData);
    await this.commentsRepository.save(createdComment);

    return {
      status: ResultStatus.Success,
      data: createdComment._id.toString(),
      errorsMessages: null,
    };
  }

  async updateComment(
    commentId: string,
    dto: UpdateCommentInputDto,
    userId: string,
  ): Promise<Result<null>> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const isUpdated = comment.updateComment(userId, dto);

    if (!isUpdated) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorsMessages: null,
      };
    }
    await this.commentsRepository.save(comment);

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<Result<null>> {
    const comment = await this.commentsRepository.findCommentById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    if (userId !== comment.commentatorInfo.userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorsMessages: null,
      };
    }
    const isDeleted = await this.commentsRepository.deleteComment(commentId);
    if (!isDeleted) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }
}
