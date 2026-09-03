import { WithId } from "mongodb";
import { LikeDbType } from "../types/like-db.model";
import { LikeDetailsViewModel } from "../types/like-details-view-model";

export function mapToLikeDetailsViewModel(
  like: WithId<LikeDbType>,
): LikeDetailsViewModel {
  return {
    addedAt: like.createdAt.toISOString(),
    userId: like.authorId,
    login: like.authorLogin,
  };
}
