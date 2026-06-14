import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { createPostInputValidation } from "../validation/create-post.input.validation";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { idParamValidation } from "../../core/validation/id-param.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { postQueryValidation } from "../validation/post-query.validation";
import { updatePostInputValidation } from "../validation/update-post.input.validation";
import { getCommentsByPostIdListHandler } from "../../comments/routers/handlers/get-comments-by-post-id.handler";
import { createCommentByPostIdHandler } from "../../comments/routers/handlers/create-comment-by-post-id.handler";
import { bearerAuthGuardMiddleware } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { commentQueryValidation } from "../../comments/validation/comment-query.validation";
import { createCommentInputValidation } from "../../comments/validation/create-comment.input.validation";

export const postsRouter = Router({});

postsRouter.get("", postQueryValidation, inputValidationResultMiddleware, getPostListHandler);

postsRouter.get("/:id", idParamValidation("id"), inputValidationResultMiddleware, getPostHandler);

postsRouter.post(
  "",
  superAdminGuardMiddleware,
  createPostInputValidation,
  inputValidationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  updatePostInputValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  inputValidationResultMiddleware,
  deletePostHandler,
);

postsRouter.get(
  "/:postId/comments",
  idParamValidation("postId"),
  commentQueryValidation,
  inputValidationResultMiddleware,
  getCommentsByPostIdListHandler,
);

postsRouter.post(
  "/:postId/comments",
  bearerAuthGuardMiddleware,
  idParamValidation("postId"),
  createCommentInputValidation,
  inputValidationResultMiddleware,
  createCommentByPostIdHandler,
);
