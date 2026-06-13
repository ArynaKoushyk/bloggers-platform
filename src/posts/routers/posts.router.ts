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

export const postsRouter = Router({});

postsRouter.get(
  "",
  postQueryValidation,
  inputValidationResultMiddleware,
  getPostListHandler,
);

postsRouter.get("/:id", idParamValidation, inputValidationResultMiddleware, getPostHandler);

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
  idParamValidation,
  updatePostInputValidation,
  inputValidationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation,
  inputValidationResultMiddleware,
  deletePostHandler,
);
