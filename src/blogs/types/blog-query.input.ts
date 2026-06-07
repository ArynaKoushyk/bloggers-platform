import { SortDirection } from "../../core/types/sort-direction";
import { BlogSortField } from "./blog-sort.type";

export type BlogQueryInput = {
  searchNameTerm: string | null;
  sortBy: BlogSortField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
