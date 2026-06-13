import { SortDirection } from "../../core/types/sort-direction";
import { UserSortField } from "./user-sort.type";

export type UserQueryInput = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UserSortField;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
