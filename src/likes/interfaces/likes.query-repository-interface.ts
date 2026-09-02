import { WithId } from "mongodb";
import { LikeDbType } from "../types/like-db.model";
import { LikeParentType } from "../types/like-parent.type";

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
}
