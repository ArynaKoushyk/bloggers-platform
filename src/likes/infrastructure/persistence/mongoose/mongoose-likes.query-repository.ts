import { injectable } from "inversify";
import { ILikesQueryRepository } from "../../../interfaces/likes.query-repository-interface";
import { WithId } from "mongodb";
import { LikeParentType } from "../../../types/like-parent.type";
import { LikeDbType } from "../../../types/like-db.model";
import { LikeModel } from "./like.model";
import { LikeStatus } from "../../../types/like-status.type";

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

  findNewestLikes(parentId: string, parentType: LikeParentType): Promise<WithId<LikeDbType>[]> {
    return LikeModel.find({ parentId, parentType, status: LikeStatus.Like })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean<WithId<LikeDbType>[]>()
      .exec();
  }
  findNewestLikesByParents(
    parentIds: string[],
    parentType: LikeParentType,
  ): Promise<WithId<LikeDbType>[]> {
    return LikeModel.aggregate<WithId<LikeDbType>>([
      {
        $match: {
          parentId: { $in: parentIds },
          parentType,
          status: LikeStatus.Like,
        },
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $group: {
          _id: "$parentId",
          likes: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          likes: { $slice: ["$likes", 3] },
        },
      },
      {
        $unwind: "$likes",
      },
      {
        $replaceRoot: {
          newRoot: "$likes",
        },
      },
    ]).exec();
  }
}
