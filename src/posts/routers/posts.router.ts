import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostHandler } from "./handlers/get-post.handler";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { postInputValidation } from "../validation/posts.validation";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { idValidation } from "../../core/validation/src/core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/validation/src/core/middlewares/validation/input-validtion-result.middleware";

export const postsRouter = Router({});

postsRouter.get("", getPostListHandler);

postsRouter.get(
  "/:id",
  idValidation,
  inputValidationResultMiddleware,
  getPostHandler,
);

postsRouter.post(
  "",
  createPostHandler,
  superAdminGuardMiddleware,
  postInputValidation,
  inputValidationResultMiddleware,
);

postsRouter.put(
  "/:id",
  updatePostHandler,
  superAdminGuardMiddleware,
  idValidation,
  postInputValidation,
  inputValidationResultMiddleware,
);

postsRouter.delete(
  "/:id",
  idValidation,
  inputValidationResultMiddleware,
  deletePostHandler,
  superAdminGuardMiddleware,
);
