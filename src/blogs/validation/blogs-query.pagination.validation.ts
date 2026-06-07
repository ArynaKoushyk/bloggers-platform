import { query } from "express-validator";
import { paginationAndSortingValidation } from "../../core/validation/src/core/middlewares/validation/pagination-validation.middleware";
import { BlogSortField } from "../types/blog-sort.type";

export const blogQueryPaginationValidation = [
  query("searchNameTerm").optional({ nullable: true }).isString().trim(),
  ...paginationAndSortingValidation(BlogSortField),
];
