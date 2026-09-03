import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { PostViewModel } from "../types/post-view-model";
import { mapToPostViewModel } from "./map-to-post-view-model.util";
import { PostDbType } from "../types/post-db.model";
import { LikeStatus } from "../../likes/types/like-status.type";
import { LikeDetailsViewModel } from "../../likes/types/like-details-view-model";

export function mapToPaginatedPostViewModel(
  data: PaginatedViewModel<WithId<PostDbType>>,
  myStatuses: Map<string, LikeStatus>,
  newestLikesByPost: Map<string, LikeDetailsViewModel[]>,
): PaginatedViewModel<PostViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map((post) =>
      mapToPostViewModel(
        post,
        myStatuses.get(post._id.toString()) ?? LikeStatus.None,
        newestLikesByPost.get(post._id.toString()) ?? [],
      ),
    ),
  };
}
