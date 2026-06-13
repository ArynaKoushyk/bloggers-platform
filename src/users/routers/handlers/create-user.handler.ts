import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/requests";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../../core/result/result.type";
import { CreateUserInputDto } from "../../dto/create-user.input.dto";
import { UserViewModel } from "../../types/user-view-model";
import { usersService } from "../../composition/users.container";
import { getUserQueryHandler } from "../../queries/get-user.query-handler";

export async function createUserHandler(
  req: RequestWithBody<CreateUserInputDto>,
  res: Response<UserViewModel | APIErrorResult>,
) {
  const createDto = req.body;

  const createResult = await usersService.createUser(createDto);
  if (createResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createResult.status)).send({
      errorsMessages: createResult.errorsMessages,
    });
  }
  const userId = createResult.data;
  const createdUserResult = await getUserQueryHandler.findUserById(userId);
  if (createdUserResult.status !== ResultStatus.Success) {
    return res.status(resultCodeToHttpException(createdUserResult.status)).send({
      errorsMessages: createdUserResult.errorsMessages,
    });
  }
  return res.status(HttpStatus.Created).send(createdUserResult.data);
}
