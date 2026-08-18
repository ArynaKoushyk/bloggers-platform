import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { PostViewModel } from "../types/post-view-model";
import { mapToPostViewModel } from "./map-to-post-view-model.util";
import { PostDbType } from "../types/post-db.model";

export function mapToPaginatedPostViewModel(
  data: PaginatedViewModel<WithId<PostDbType>>,
): PaginatedViewModel<PostViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map(mapToPostViewModel),
  };
}
