import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { CommentDbType } from "../types/comment-db.model";
import { CommentViewModel } from "../types/comment-view-model";
import { mapToCommentViewModel } from "./map-to-comment-view-model.util";

export function mapToPaginatedCommentViewModel(
  data: PaginatedViewModel<WithId<CommentDbType>>,
): PaginatedViewModel<CommentViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map(mapToCommentViewModel),
  };
}
