import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idValidation } from "../../core/validation/src/core/middlewares/validation/params-id-validation-middleware";

import { blogInputDtoValidation } from "../validation/blogs.validation";
import { inputValidationResultMiddleware } from "../../core/validation/src/core/middlewares/validation/input-validation-result.middleware";
import { createPostByBlogIdHandler } from "../../posts/routers/handlers/create-post-by-blog-id.handler";
import { postInputWithoutBlogIdValidation } from "../../posts/validation/posts.validation";
import { blogQueryPaginationValidation } from "../validation/blogs-query.pagination.validation";
import { postQueryPaginationValidation } from "../../posts/validation/post-query.pagination.validation";
import { getPostsByBlogIdHandler } from "../../posts/routers/handlers/get-posts-by-blog-id.handler";

export const blogsRouter = Router({});

blogsRouter.get(
  "",
  blogQueryPaginationValidation,
  inputValidationResultMiddleware,
  getBlogListHandler,
);

blogsRouter.get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  createBlogHandler,
);

blogsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  "/:id",

  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deleteBlogHandler,
);

blogsRouter.get(
  "/:id/posts",
  idValidation,
  postQueryPaginationValidation,
  inputValidationResultMiddleware,
  getPostsByBlogIdHandler,
);

blogsRouter.post(
  "/:id/posts",
  superAdminGuardMiddleware,
  idValidation,
  postInputWithoutBlogIdValidation,
  inputValidationResultMiddleware,
  createPostByBlogIdHandler,
);
