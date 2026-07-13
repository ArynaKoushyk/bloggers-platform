import { WithId } from "mongodb";
import { UserQueryInput } from "../../types/user-query.input";
import { UserDbModel } from "../../types/user-db.model";

export interface IUsersQueryRepository {
  findAllUsers(
    query: UserQueryInput,
  ): Promise<{ items: WithId<UserDbModel>[]; totalCount: number }>;

  findUserById(id: string): Promise<WithId<UserDbModel> | null>;
}
