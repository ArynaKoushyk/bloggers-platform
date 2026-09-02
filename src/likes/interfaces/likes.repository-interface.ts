import { LikeDocument } from "../infrastructure/persistence/mongoose/like.model";
import { LikeParentType } from "../types/like-parent.type";

export interface ILikesRepository {
  findLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<LikeDocument | null>;

  save(like: LikeDocument): Promise<void>;

  deleteLike(
    parentId: string,
    parentType: LikeParentType,
    authorId: string,
  ): Promise<boolean>;

  deleteLikesByParent(parentId: string, parentType: LikeParentType): Promise<void>;
}
