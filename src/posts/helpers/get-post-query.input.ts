import { Request } from "express";
import { SortDirection } from "../../core/types/sort-direction";
import { PostQueryInput } from "../types/post-query.input";
import { PostSortField } from "../types/post-sort.type";

export const getPostQueryInput = (req: Request): PostQueryInput => {
  return {
    sortBy: (req.query.sortBy ?? PostSortField.CreatedAt) as PostSortField,
    sortDirection: (req.query.sortDirection ?? SortDirection.Desc) as SortDirection,
    pageNumber: Number(req.query.pageNumber ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
  };
};
