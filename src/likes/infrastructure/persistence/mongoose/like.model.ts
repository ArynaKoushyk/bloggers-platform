import { HydratedDocument, model, Schema } from "mongoose";
import { LikeDbType } from "../../../types/like-db.model";
import { LikeParentType } from "../../../types/like-parent.type";
import { LikeStatus } from "../../../types/like-status.type";

export type LikeDocument = HydratedDocument<LikeDbType>;

const likeSchema = new Schema<LikeDbType>(
  {
    parentId: { type: String, required: true },
    parentType: { type: String, enum: LikeParentType, required: true },
    authorId: { type: String, required: true },
    authorLogin: { type: String, required: true },
    status: {
      type: String,
      enum: [LikeStatus.Like, LikeStatus.Dislike],
      required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export const LikeModel = model<LikeDbType>("Like", likeSchema, "likes");
