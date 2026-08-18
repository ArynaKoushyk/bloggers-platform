import { WithId } from "mongodb";
import { UserQueryInput } from "../../types/user-query.input";
import { UserDbType } from "../../types/user-db.model";

export interface IUsersQueryRepository {
  findAllUsers(
    query: UserQueryInput,
  ): Promise<{ items: WithId<UserDbType>[]; totalCount: number }>;

  findUserById(id: string): Promise<WithId<UserDbType> | null>;
}
