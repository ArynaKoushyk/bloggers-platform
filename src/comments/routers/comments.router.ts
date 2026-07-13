import { Router } from "express";

import { idParamValidation } from "../../core/validation/id-param.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { bearerAuthGuardMiddleware } from "../../auth/middlewares/bearer-auth.guard-middleware";
import { updateCommentInputValidation } from "../validation/update-comment.input.validation";
import { commentsController } from "../../core/composition/composition-root";


export const commentsRouter = Router({});
commentsRouter.get(
  "/:id",
  idParamValidation("id"),
  inputValidationResultMiddleware,
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
