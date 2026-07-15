import { IUsersService } from "../applications/interfaces/users.service.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { RequestWithBody, RequestWithParams } from "../../core/types/requests";
import { ResultStatus } from "../../core/result/resultCode";
import { resultCodeToHttpException } from "../../core/result/resultCodeToHttpException";
import { APIErrorResult } from "../../core/result/result.type";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { UserViewModel } from "../types/user-view-model";
import { getUserQueryInput } from "../helpers/get-user-query.input";
import { inject, injectable } from "inversify";
import { USERS_SERVICE } from "../../core/composition/di-tokens";
import { GetUserQueryHandler } from "../queries/get-user.query-handler";
import { GetUsersListQueryHandler } from "../queries/get-users-list.query-handler";

@injectable()
export class UsersController {
  constructor(
    @inject(USERS_SERVICE) private usersService: IUsersService,
    @inject(GetUserQueryHandler) private getUserQueryHandler: GetUserQueryHandler,
    @inject(GetUsersListQueryHandler) private getUsersListQueryHandler: GetUsersListQueryHandler,
  ) {}

  async createUserHandler(
    req: RequestWithBody<CreateUserInputDto>,
    res: Response<UserViewModel | APIErrorResult>,
  ) {
    const createDto = req.body;

    const createResult = await this.usersService.createUser(createDto);
    if (createResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createResult.status)).send({
        errorsMessages: createResult.errorsMessages,
      });
    }
    const userId = createResult.data;
    const createdUserResult = await this.getUserQueryHandler.findUserById(userId);
    if (createdUserResult.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(createdUserResult.status)).send({
        errorsMessages: createdUserResult.errorsMessages,
      });
    }
    return res.status(HttpStatus.Created).send(createdUserResult.data);
  }

  async deleteUserHandler(req: RequestWithParams<{ id: string }>, res: Response) {
    const userId = req.params.id;
    const deleteResult = await this.usersService.deleteUser(userId);
    if (deleteResult.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(deleteResult.status));
    } else {
      return res.sendStatus(HttpStatus.NoContent);
    }
  }

  async getUserListHandler(req: Request, res: Response) {
    const query = getUserQueryInput(req);
    const result = await this.getUsersListQueryHandler.findAllUsers(query);
    if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send({
        errorsMessages: result.errorsMessages,
      });
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }

  async getUserHandler(
    req: RequestWithParams<{ id: string }>,
    res: Response<UserViewModel | APIErrorResult>,
  ) {
    const id = req.params.id;
    const result = await this.getUserQueryHandler.findUserById(id);

    if (result.status !== ResultStatus.Success) {
      return res.sendStatus(resultCodeToHttpException(result.status));
    }
    return res.status(HttpStatus.Ok).send(result.data);
  }
}
