import { Request } from "express";
import { SortDirection } from "../../core/types/sort-direction";
import { UserQueryInput } from "../types/user-query.input";
import { UserSortField } from "../types/user-sort.type";

export const getUserQueryInput = (req: Request): UserQueryInput => {
  return {
    searchLoginTerm: req.query.searchLoginTerm ? String(req.query.searchLoginTerm) : null,
    searchEmailTerm: req.query.searchEmailTerm ? String(req.query.searchEmailTerm) : null,
    sortBy: (req.query.sortBy ?? UserSortField.CreatedAt) as UserSortField,
    sortDirection: (req.query.sortDirection ?? SortDirection.Desc) as SortDirection,
    pageNumber: Number(req.query.pageNumber ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
  };
};
