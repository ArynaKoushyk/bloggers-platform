import { Router } from "express";
import { getUserListHandler } from "./handlers/get-user-list.handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { userQueryValidation } from "../validation/user-query.validation";
import { inputValidationResultMiddleware } from "../../core/validation/input-validation-result.middleware";
import { createUserHandler } from "./handlers/create-user.handler";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { createUserInputValidation } from "../validation/create-user.input.validation";
import { idParamValidation } from "../../core/validation/id-param.validation";

export const usersRouter = Router({});

usersRouter.get(
  "",
  superAdminGuardMiddleware,
  userQueryValidation,
  inputValidationResultMiddleware,
  getUserListHandler,
);
usersRouter.post(
  "",
  superAdminGuardMiddleware,
  createUserInputValidation,
  inputValidationResultMiddleware,
  createUserHandler,
);
usersRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idParamValidation('id'),
  inputValidationResultMiddleware,
  deleteUserHandler,
);
