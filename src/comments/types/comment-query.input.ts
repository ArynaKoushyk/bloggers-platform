import { SortDirection } from "../../core/types/sort-direction";
import { CommentSortField } from "./comment-sort.type";

export type CommentQueryInput = {
  sortBy: CommentSortField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
