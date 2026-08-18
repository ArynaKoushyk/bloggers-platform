import mongoose, { HydratedDocument, Model } from "mongoose";
import { CommentatorInfo } from "../../../types/commentator-info.type";
import { CommentDbType } from "../../../types/comment-db.model";
import { CreateCommentData } from "../../../types/data/create-comment.data";
import { UpdateCommentData } from "../../../types/data/update-comment.data";

const { Schema, model } = mongoose;

export type CommentDocument = HydratedDocument<CommentDbType, CommentMethods>;

type CommentModelType = Model<CommentDbType, {}, CommentMethods> & CommentStatics;

type CommentStatics = typeof CommentEntity;

interface CommentMethods {
  isOwner(userId: string): boolean;
  updateComment(userId: string, data: UpdateCommentData): boolean;
}

class CommentEntity {
  private constructor() {}

  static createComment(data: CreateCommentData): CommentDocument {
    const { postId, content, commentatorInfo } = data;
    const comment = new CommentModel();
    comment.postId = postId;
    comment.content = content;
    comment.commentatorInfo = commentatorInfo;
    comment.createdAt = new Date();
    return comment;
  }

  isOwner(this: CommentDocument, userId: string): boolean {
    return this.commentatorInfo.userId === userId;
  }
  updateComment(this: CommentDocument, userId: string, data: UpdateCommentData): boolean {
    const { content } = data;
    if (!this.isOwner(userId)) {
      return false;
    }
    this.content = content;

    return true;
  }
}

const commentatorInfoSchema = new Schema<CommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false },
);

const commentSchema = new Schema<
  CommentDbType,
  CommentModelType,
  CommentMethods,
  {},
  {},
  CommentStatics
>(
  {
    postId: { type: String, required: true },
    content: { type: String, required: true, minlength: 1, maxLength: 500 },
    commentatorInfo: { type: commentatorInfoSchema, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { optimisticConcurrency: true },
);

commentSchema.loadClass(CommentEntity);
export const CommentModel = model<CommentDbType, CommentModelType>(
  "Comment",
  commentSchema,
  "comments",
);
