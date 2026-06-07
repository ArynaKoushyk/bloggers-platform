import { SortDirection } from "../../core/types/sort-direction";
import { PostSortField } from "./post-sort.type";

export type PostQueryInput = {
  sortBy: PostSortField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

