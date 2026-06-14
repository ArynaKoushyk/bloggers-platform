import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idParamValidation } from "../../core/validation/id-param.validation";

import { createBlogInputValidation } from "../validation/create-blog.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { createPostByBlogIdHandler } from "../../posts/routers/handlers/create-post-by-blog-id.handler";
import { createPostByBlogIdInputValidation } from "../../posts/validation/create-post-by-blog-id.input.validation";
import { blogQueryValidation } from "../validation/blog-query.validation";
import { postQueryValidation } from "../../posts/validation/post-query.validation";
import { getPostsByBlogIdHandler } from "../../posts/routers/handlers/get-posts-by-blog-id.handler";
import { updateBlogInputValidation } from "../validation/update-blog.input.validation";

export const blogsRouter = Router({});

blogsRouter.get("", blogQueryValidation, inputValidationResultMiddleware, getBlogListHandler);

blogsRouter.get("/:id", idParamValidation("id"), inputValidationResultMiddleware, getBlogHandler);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  createBlogInputValidation,
  inputValidationResultMiddleware,
  createBlogHandler,
);

blogsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  updateBlogInputValidation,
  inputValidationResultMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  "/:id",

  superAdminGuardMiddleware,
  idParamValidation("id"),
  inputValidationResultMiddleware,
  deleteBlogHandler,
);

blogsRouter.get(
  "/:id/posts",
  idParamValidation("id"),
  postQueryValidation,
  inputValidationResultMiddleware,
  getPostsByBlogIdHandler,
);

blogsRouter.post(
  "/:id/posts",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  createPostByBlogIdInputValidation,
  inputValidationResultMiddleware,
  createPostByBlogIdHandler,
);
