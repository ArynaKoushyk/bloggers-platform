import { Request } from "express";
import { SortDirection } from "../../core/types/sort-direction";
import { BlogQueryInput } from "../types/blog-query.input";
import { BlogSortField } from "../types/blog-sort.type";

export const getBlogQueryInput = (req: Request): BlogQueryInput => {
  return {
    searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : null,
    sortBy: (req.query.sortBy ?? BlogSortField.CreatedAt) as BlogSortField,
    sortDirection: (req.query.sortDirection ?? SortDirection.Desc) as SortDirection,
    pageNumber: Number(req.query.pageNumber ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
  };
};
