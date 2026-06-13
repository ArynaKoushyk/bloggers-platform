import { query } from "express-validator";
import { paginationAndSortingValidation } from "../../core/validation/pagination-and-sorting.validation";
import { BlogSortField } from "../types/blog-sort.type";

export const blogQueryValidation = [
  query("searchNameTerm").optional({ nullable: true }).isString().trim(),
  ...paginationAndSortingValidation(BlogSortField),
];
