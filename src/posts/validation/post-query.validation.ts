import { paginationAndSortingValidation } from "../../core/validation/pagination-and-sorting.validation";
import { PostSortField } from "../types/post-sort.type";

export const postQueryValidation = [
  ...paginationAndSortingValidation(PostSortField),
];
