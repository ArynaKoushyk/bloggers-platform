import { WithId } from "mongodb";
import { UserDbModel } from "../types/user-db.model";
import { UserEntity } from "../types/domain/user-entity.model";

export function mapUserDbToEntity(user: WithId<UserDbModel>): UserEntity {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: user.createdAt,
  };
}
