import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PostsRepository } from "../../posts/applications/types/posts.repository.type";
import { CommentEntity } from "../types/domain/comment-entity.model";
import { CommentsRepository } from "./types/comments.repository.type";
import { CommentsService } from "./types/comments.service.type";
import { CreateCommentInputDto } from "../dto/create-comment.input.dto";
import { AuthUserType } from "../../auth/types/auth-user.type";
import { CreateCommentData } from "../types/data/create-comment.data";
import { UpdateCommentInputDto } from "../dto/update-comment.input.dto";
import { UpdateCommentData } from "../types/data/update-comment.data";

export const createCommentsService = (
  commentsRepository: CommentsRepository,
  postsRepository: PostsRepository,
): CommentsService => {
  return {
    async findCommentById(id: string): Promise<Result<CommentEntity>> {
      const comment = await commentsRepository.findCommentById(id);
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
    },

    async createComment(
      postId: string,
      dto: CreateCommentInputDto,
      user: AuthUserType,
    ): Promise<Result<string>> {
      const { content } = dto;

      const post = await postsRepository.findPostById(postId);
      if (!post) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }

      const createData: CreateCommentData = {
        postId: post.id,
        content,
        commentatorInfo: {
          userId: user.id,
          userLogin: user.login,
        },
        createdAt: new Date().toISOString(),
      };

      const commentId = await commentsRepository.createComment(createData);

      return {
        status: ResultStatus.Success,
        data: commentId,
        errorsMessages: null,
      };
    },

    //!!
    async updateComment(
      commentId: string,
      dto: UpdateCommentInputDto,
      userId: string,
    ): Promise<Result<null>> {
      const { content } = dto;

      const comment = await commentsRepository.findCommentById(commentId);
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
      const updateData: UpdateCommentData = {
        content,
      };
      
      const isUpdated = await commentsRepository.updateComment(commentId, updateData);
      if (!isUpdated) {
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
    },

    async deleteComment(commentId: string, userId: string): Promise<Result<null>> {
      const comment = await commentsRepository.findCommentById(commentId);
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
      const isDeleted = await commentsRepository.deleteComment(commentId);
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
    },
  };
};
