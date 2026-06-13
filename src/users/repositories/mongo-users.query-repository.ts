import { ObjectId, WithId } from "mongodb";
import { UserDbModel } from "../types/user-db.model";
import { UserQueryInput } from "../types/user-query.input";
import { userCollection } from "../../db/mongo.db";

export const usersQueryRepository = {
  async findAllUsers(
    query: UserQueryInput,
  ): Promise<{ items: WithId<UserDbModel>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
    } = query;
    const skip = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    const filter: any = {};
    const searchConditions = [];

    //!!переделать на or
    if (searchLoginTerm) {
      searchConditions.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }

    if (searchEmailTerm) {
      searchConditions.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }
    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async findUserById(id: string): Promise<WithId<UserDbModel> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  },
};
