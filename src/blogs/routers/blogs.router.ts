import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { idValidation } from "../../core/validation/src/core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/validation/src/core/middlewares/validation/input-validtion-result.middleware";
import { postInputValidation } from "../../posts/validation/posts.validation";
import { blogInputDtoValidation } from "../validation/blogs.validation";
export const blogsRouter = Router({});

blogsRouter.get("", getBlogListHandler);

blogsRouter.get(
  "/:id",
  idValidation,
  inputValidationResultMiddleware,
  getBlogHandler,
);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  createBlogHandler,
);

blogsRouter.put(
  "/:id",
  idValidation,
  superAdminGuardMiddleware,
  blogInputDtoValidation,
  inputValidationResultMiddleware,
  updateBlogHandler,
);

blogsRouter.delete(
  "/:id",
  idValidation,
  superAdminGuardMiddleware,
  inputValidationResultMiddleware,
  deleteBlogHandler,
);
