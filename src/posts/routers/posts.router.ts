import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { createPostInputValidation } from "../validation/create-post.input.validation";
import { idParamValidation } from "../../core/validation/id-param.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { postQueryValidation } from "../validation/post-query.validation";
import { updatePostInputValidation } from "../validation/update-post.input.validation";
import { bearerAuthGuardMiddleware } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { commentQueryValidation } from "../../comments/validation/comment-query.validation";
import { createCommentInputValidation } from "../../comments/validation/create-comment.input.validation";
import { commentsController, postsController } from "../../core/composition/composition-root";
import { optionalAuthGuardMiddleware } from "../../auth/middlewares/optional-bearer-auth.middleware";
import { updateLikeStatusInputValidation } from "../../likes/validation/update-like-status.input.validation";

export const postsRouter = Router({});

postsRouter.get(
  "",
  postQueryValidation,
  inputValidationResultMiddleware,
  optionalAuthGuardMiddleware,
  postsController.getPostListHandler.bind(postsController),
);

postsRouter.get(
  "/:id",
  idParamValidation("id"),
  inputValidationResultMiddleware,
  optionalAuthGuardMiddleware,
  postsController.getPostHandler.bind(postsController),
);

postsRouter.post(
  "",
  superAdminGuardMiddleware,
  createPostInputValidation,
  inputValidationResultMiddleware,
  postsController.createPostHandler.bind(postsController),
);

postsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  updatePostInputValidation,
  inputValidationResultMiddleware,
  postsController.updatePostHandler.bind(postsController),
);

postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  inputValidationResultMiddleware,
  postsController.deletePostHandler.bind(postsController),
);

postsRouter.get(
  "/:postId/comments",
  idParamValidation("postId"),
  commentQueryValidation,
  inputValidationResultMiddleware,
  optionalAuthGuardMiddleware,
  commentsController.getCommentsByPostIdListHandler.bind(commentsController),
);

postsRouter.post(
  "/:postId/comments",
  bearerAuthGuardMiddleware,
  idParamValidation("postId"),
  createCommentInputValidation,
  inputValidationResultMiddleware,
  commentsController.createCommentByPostIdHandler.bind(commentsController),
);

postsRouter.put(
  "/:postId/like-status",
  bearerAuthGuardMiddleware,
  idParamValidation("postId"),
  updateLikeStatusInputValidation,
  inputValidationResultMiddleware,
  postsController.updatePostLikeStatusHandler.bind(postsController),
);
