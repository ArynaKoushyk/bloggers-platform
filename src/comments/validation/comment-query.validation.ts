
import { paginationAndSortingValidation } from "../../core/validation/pagination-and-sorting.validation";
import { CommentSortField } from "../types/comment-sort.type";

export const commentQueryValidation = [
  ...paginationAndSortingValidation(CommentSortField),
];

