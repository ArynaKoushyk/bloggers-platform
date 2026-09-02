import { body } from "express-validator";
import { LikeStatus } from "../types/like-status.type";

export const updateLikeStatusValidation = body("likeStatus")
  .exists()
  .withMessage("Like status is required")
  .isString()
  .withMessage("Like status should be a string")
  .isIn(Object.values(LikeStatus))
  .withMessage("Incorrect like status");

export const updateLikeStatusInputValidation = [updateLikeStatusValidation];
