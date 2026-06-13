import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { BlogViewModel } from "../types/blog-view-model";
import { mapToBlogViewModel } from "./map-to-blog-view-model.util";
import { BlogDbModel } from "../types/blog-db.model";

export function mapToPaginatedBlogViewModel(
  data: PaginatedViewModel<WithId<BlogDbModel>>,
): PaginatedViewModel<BlogViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map(mapToBlogViewModel),
  };
  
}
