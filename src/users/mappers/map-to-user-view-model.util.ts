import { WithId } from "mongodb";
import { UserViewModel } from "../types/user-view-model";
import { UserDbModel } from "../types/user-db.model";

export function mapToUserViewModel(user: WithId<UserDbModel>): UserViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}
