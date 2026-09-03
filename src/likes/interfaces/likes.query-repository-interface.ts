import { WithId } from "mongodb";
import { LikeDbType } from "../types/like-db.model";
import { LikeParentType } from "../types/like-parent.type";
import { LikeStatus } from "../types/like-status.type";

export interface ILikesQueryRepository {
  findLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<WithId<LikeDbType> | null>;

  findLikesByParents(
    parentIds: string[],
    parentType: LikeParentType,
    authorId: string,
  ): Promise<WithId<LikeDbType>[]>;

  findNewestLikes(parentId: string, parentType: LikeParentType): Promise<WithId<LikeDbType>[]>;
  
  findNewestLikesByParents(
    parentIds: string[],
    parentType: LikeParentType,
  ): Promise<WithId<LikeDbType>[]>;
}
