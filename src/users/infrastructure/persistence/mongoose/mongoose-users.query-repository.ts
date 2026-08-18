import { WithId } from "mongodb";
import { injectable } from "inversify";
import { IUsersQueryRepository } from "../../../applications/interfaces/users.repository.query-interface";
import { UserQueryInput } from "../../../types/user-query.input";
import { UserDbType } from "../../../types/user-db.model";
import { UserModel } from "./user.model";
import { QueryFilter } from "mongoose";

@injectable()
export class MongoUsersQueryRepository implements IUsersQueryRepository {
  async findAllUsers(
    query: UserQueryInput,
  ): Promise<{ items: WithId<UserDbType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: QueryFilter<UserDbType> = {};
    const searchConditions = [];

    if (searchLoginTerm) {
      searchConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }

    if (searchEmailTerm) {
      searchConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }
    const items = await UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean<WithId<UserDbType>[]>()
      .exec();

    const totalCount = await UserModel.countDocuments(filter).exec();
    return { items, totalCount };
  }

  async findUserById(id: string): Promise<WithId<UserDbType> | null> {
    return UserModel.findById(id).lean<WithId<UserDbType>>().exec();
  }
}
