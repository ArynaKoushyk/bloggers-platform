import { injectable } from "inversify";
import { ILikesQueryRepository } from "../../../interfaces/likes.query-repository-interface";
import { WithId } from "mongodb";
import { LikeParentType } from "../../../types/like-parent.type";
import { LikeDbType } from "../../../types/like-db.model";
import { LikeModel } from "./like.model";

@injectable()
export class MongoLikesQueryRepository implements ILikesQueryRepository {
  findLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<WithId<LikeDbType> | null> {
    return LikeModel.findOne({ parentId, parentType, authorId }).lean<WithId<LikeDbType>>().exec();
  }

  findLikesByParents(
    parentIds: string[],
    parentType: LikeParentType,
    authorId: string,
  ): Promise<WithId<LikeDbType>[]> {
    return LikeModel.find({ parentId: { $in: parentIds }, parentType, authorId })
      .lean<WithId<LikeDbType>[]>()
      .exec();
  }
}
