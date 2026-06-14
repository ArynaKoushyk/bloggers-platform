import { Router } from "express";
import { getCommentHandler } from "./handlers/get-comment.handler";
import { updateCommentHandler } from "./handlers/update-comment.handler";
import { deleteCommentHandler } from "./handlers/delete-comment.handler";
import { idParamValidation } from "../../core/validation/id-param.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { bearerAuthGuardMiddleware } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { updateCommentInputValidation } from "../validation/update-comment.input.validation";

export const commentsRouter = Router({});
commentsRouter.get(
  "/:id",
  idParamValidation("id"),
  inputValidationResultMiddleware,
  getCommentHandler,
);
commentsRouter.put(
  "/:commentId",
  bearerAuthGuardMiddleware,
  idParamValidation("commentId"),
  updateCommentInputValidation,
  inputValidationResultMiddleware,
  updateCommentHandler,
);
commentsRouter.delete(
  "/:commentId",
  bearerAuthGuardMiddleware,
  idParamValidation("commentId"),
  inputValidationResultMiddleware,
  deleteCommentHandler,
);
