import { paginationAndSortingValidation } from "../../core/validation/src/core/middlewares/validation/pagination-validation.middleware";
import { PostSortField } from "../types/post-sort.type";

export const postQueryPaginationValidation = [
  ...paginationAndSortingValidation(PostSortField),
];
