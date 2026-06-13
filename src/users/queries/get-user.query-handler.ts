import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { mapToUserViewModel } from "../mappers/map-to-user-view-model.util";
import { usersQueryRepository } from "../repositories/mongo-users.query-repository";
import { UserViewModel } from "../types/user-view-model";

export const getUserQueryHandler = {
  async findUserById(id: string): Promise<Result<UserViewModel>> {
    const user = await usersQueryRepository.findUserById(id);

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
  },
};
