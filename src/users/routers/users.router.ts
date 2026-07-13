import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userQueryValidation } from "../validation/user-query.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { createUserInputValidation } from "../validation/create-user.input.validation";
import { idParamValidation } from "../../core/validation/id-param.validation";
import { usersController } from "../../core/composition/composition-root";

export const usersRouter = Router({});

usersRouter.get(
  "",
  superAdminGuardMiddleware,
  userQueryValidation,
  inputValidationResultMiddleware,
  usersController.getUserListHandler.bind(usersController),
);
usersRouter.post(
  "",
  superAdminGuardMiddleware,
  createUserInputValidation,
  inputValidationResultMiddleware,
  usersController.createUserHandler.bind(usersController),
);
usersRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation("id"),
  inputValidationResultMiddleware,
  usersController.deleteUserHandler.bind(usersController),
);
