import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { postInputValidation } from "../validation/posts.validation";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { idValidation } from "../../core/validation/src/core/middlewares/validation/params-id-validation-middleware";
import { inputValidationResultMiddleware } from "../../core/validation/src/core/middlewares/validation/input-validation-result.middleware";
import { postQueryPaginationValidation } from "../validation/post-query.pagination.validation";

export const postsRouter = Router({});

postsRouter.get(
  "",
  postQueryPaginationValidation,
  inputValidationResultMiddleware,
  getPostListHandler,
);

postsRouter.get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler);

postsRouter.post(
  "",
  superAdminGuardMiddleware,
  postInputValidation,
  inputValidationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  postInputValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deletePostHandler,
);
