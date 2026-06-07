import { WithId } from "mongodb";
import { PaginatedViewModel } from "../../../core/types/paginated-view.model";
import { Blog } from "../../types/domain/blogs.type";
import { BlogViewModel } from "../../types/blog-view-model";
import { mapToBlogViewModel } from "./map-to-blog-view-model.util";

export function mapToPaginatedBlogViewModel(
  data: PaginatedViewModel<WithId<Blog>>,
): PaginatedViewModel<BlogViewModel> {
  return {
    pagesCount: data.pagesCount,
    page: data.page,
    pageSize: data.pageSize,
    totalCount: data.totalCount,
    items: data.items.map(mapToBlogViewModel),
  };
}
