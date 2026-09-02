import { injectable } from "inversify";
import { ILikesRepository } from "../../../interfaces/likes.repository-interface";
import { LikeParentType } from "../../../types/like-parent.type";
import { LikeDocument, LikeModel } from "./like.model";

@injectable()
export class MongoLikesRepository implements ILikesRepository {
  async findLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<LikeDocument | null> {
    return LikeModel.findOne({ parentId, parentType, authorId }).exec();
  }

  async save(like: LikeDocument): Promise<void> {
    await like.save();
  }

  async deleteLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<boolean> {
    const deleteResult = await LikeModel.deleteOne({ parentId, parentType, authorId }).exec();
    return deleteResult.deletedCount === 1;
  }

  async deleteLikesByParent(parentId: string, parentType: LikeParentType): Promise<void> {
    await LikeModel.deleteMany({ parentId, parentType }).exec();
  }
}
