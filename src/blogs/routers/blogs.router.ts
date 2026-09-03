import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { idParamValidation } from "../../core/validation/id-param.validation";
import { createBlogInputValidation } from "../validation/create-blog.input.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { createPostByBlogIdInputValidation } from "../../posts/validation/create-post-by-blog-id.input.validation";
import { blogQueryValidation } from "../validation/blog-query.validation";
import { postQueryValidation } from "../../posts/validation/post-query.validation";
import { updateBlogInputValidation } from "../validation/update-blog.input.validation";
import { blogsController, postsController } from "../../core/composition/composition-root";
import { optionalAuthGuardMiddleware } from "../../auth/middlewares/optional-bearer-auth.middleware";
export const blogsRouter = Router({});

blogsRouter.get(
  "",
  blogQueryValidation,
  inputValidationResultMiddleware,
  blogsController.getBlogListHandler.bind(blogsController),
);

blogsRouter.get(
  "/:id",
  idParamValidation("id"),
  inputValidationResultMiddleware,
  blogsController.getBlogHandler.bind(blogsController),
);

blogsRouter.post(
  "",
  superAdminGuardMiddleware,
  createBlogInputValidation,
  inputValidationResultMiddleware,
  blogsController.createBlogHandler.bind(blogsController),
);

blogsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  updateBlogInputValidation,
  inputValidationResultMiddleware,
  blogsController.updateBlogHandler.bind(blogsController),
);

blogsRouter.delete(
  "/:id",

  superAdminGuardMiddleware,
  idParamValidation("id"),
  inputValidationResultMiddleware,
  blogsController.deleteBlogHandler.bind(blogsController),
);

blogsRouter.get(
  "/:id/posts",
  idParamValidation("id"),
  postQueryValidation,
  inputValidationResultMiddleware,
  optionalAuthGuardMiddleware,
  postsController.getPostsByBlogIdHandler.bind(postsController),
);

blogsRouter.post(
  "/:id/posts",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  createPostByBlogIdInputValidation,
  inputValidationResultMiddleware,
  postsController.createPostByBlogIdHandler.bind(postsController),
);
