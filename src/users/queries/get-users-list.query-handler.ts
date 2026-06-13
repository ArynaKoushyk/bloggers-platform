import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { userCollection } from "../../db/mongo.db";
import { mapToPaginatedUserViewModel } from "../mappers/map-to-user-paginated-model.util";
import { usersQueryRepository } from "../repositories/mongo-users.query-repository";
import { UserQueryInput } from "../types/user-query.input";
import { UserViewModel } from "../types/user-view-model";

export const getUsersListQueryHandler = {
  async findAllUsers(
    query: UserQueryInput,
  ): Promise<Result<PaginatedViewModel<UserViewModel>>> {
    const { items, totalCount } = await usersQueryRepository.findAllUsers(query);

    const paginatedUsers = mapToPaginatedUserViewModel({
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });

    return {
      status: ResultStatus.Success,
      data: paginatedUsers,
      errorsMessages: null,
    };
  },
};
