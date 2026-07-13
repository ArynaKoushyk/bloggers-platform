import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { PaginatedViewModel } from "../../core/types/paginated-view.model";
import { IUsersQueryRepository } from "../applications/interfaces/users.repository.query-interface";
import { mapToPaginatedUserViewModel } from "../mappers/map-to-user-paginated-model.util";
import { UserQueryInput } from "../types/user-query.input";
import { UserViewModel } from "../types/user-view-model";

export class GetUsersListQueryHandler {
  constructor(private usersQueryRepository: IUsersQueryRepository) {}
  async findAllUsers(query: UserQueryInput): Promise<Result<PaginatedViewModel<UserViewModel>>> {
    const { items, totalCount } = await this.usersQueryRepository.findAllUsers(query);

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
  }
}
