import { Request } from "express";
import { SortDirection } from "../../core/types/sort-direction";
import { CommentQueryInput } from "../types/comment-query.input";
import { CommentSortField } from "../types/comment-sort.type";

export const getCommentQueryInput = (req: Request): CommentQueryInput => {
  return {
    sortBy: (req.query.sortBy ?? CommentSortField.CreatedAt) as CommentSortField,
    sortDirection: (req.query.sortDirection ?? SortDirection.Desc) as SortDirection,
    pageNumber: Number(req.query.pageNumber ?? 1),
    pageSize: Number(req.query.pageSize ?? 10),
  };
};
