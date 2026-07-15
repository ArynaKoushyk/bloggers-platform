import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IUsersQueryRepository } from "../applications/interfaces/users.repository.query-interface";
import { mapToUserViewModel } from "../mappers/map-to-user-view-model.util";
import { UserViewModel } from "../types/user-view-model";

import { inject, injectable } from "inversify";
import { USERS_QUERY_REPOSITORY } from "../../core/composition/di-tokens";

@injectable()
export class GetUserQueryHandler {
  constructor(
    @inject(USERS_QUERY_REPOSITORY) private usersQueryRepository: IUsersQueryRepository,
  ) {}
  async findUserById(id: string): Promise<Result<UserViewModel>> {
    const user = await this.usersQueryRepository.findUserById(id);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    return {
      status: ResultStatus.Success,
      data: mapToUserViewModel(user),
      errorsMessages: null,
    };
  }
}
