import { query } from "express-validator";
import { paginationAndSortingValidation } from "../../core/validation/pagination-and-sorting.validation";
import { UserSortField } from "../types/user-sort.type";

export const userQueryValidation = [
  query("searchLoginTerm").optional({ nullable: true }).isString().trim(),
  query("searchEmailTerm").optional({ nullable: true }).isString().trim(),
  ...paginationAndSortingValidation(UserSortField),
];
