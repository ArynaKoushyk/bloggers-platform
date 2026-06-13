import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { UserDbModel } from "../types/user-db.model";
import { UserViewModel } from "../types/user-view-model";
import { mapToUserViewModel } from "./map-to-user-view-model.util";

export function mapToPaginatedUserViewModel(
  data: PaginatedViewModel<WithId<UserDbModel>>,
): PaginatedViewModel<UserViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map(mapToUserViewModel),
  };
}
