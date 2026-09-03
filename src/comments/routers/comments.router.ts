import { Router } from "express";

import { idParamValidation } from "../../core/validation/id-param.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { bearerAuthGuardMiddleware } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { updateCommentInputValidation } from "../validation/update-comment.input.validation";
import { commentsController } from "../../core/composition/composition-root";
import { updateLikeStatusInputValidation } from "../../likes/validation/update-like-status.input.validation";
import { optionalAuthGuardMiddleware } from "../../auth/middlewares/optional-bearer-auth.middleware";

export const commentsRouter = Router({});
commentsRouter.get(
  "/:id",
  idParamValidation("id"),
  inputValidationResultMiddleware,
  optionalAuthGuardMiddleware,
  commentsController.getCommentHandler.bind(commentsController),
);

commentsRouter.put(
  "/:commentId",
  bearerAuthGuardMiddleware,
  idParamValidation("commentId"),
  updateCommentInputValidation,
  inputValidationResultMiddleware,
  commentsController.updateCommentHandler.bind(commentsController),
);
commentsRouter.delete(
  "/:commentId",
  bearerAuthGuardMiddleware,
  idParamValidation("commentId"),
  inputValidationResultMiddleware,
  commentsController.deleteCommentHandler.bind(commentsController),
);

commentsRouter.put(
  "/:commentId/like-status",
  bearerAuthGuardMiddleware,
  idParamValidation("commentId"),
  updateLikeStatusInputValidation,
  inputValidationResultMiddleware,
  commentsController.updateCommentLikeStatusHandler.bind(commentsController),
);


