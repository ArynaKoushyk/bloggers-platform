import { CreateUserData } from "../../types/data/create-user.data";
import { UserEntity } from "../../types/domain/user-entity.model";

export type UsersRepository = {
  findUserById(id: string): Promise<UserEntity | null>;
  findUserByLogin(login: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null>;
  createUser(data: CreateUserData): Promise<string>;
  deleteUser(id: string): Promise<boolean>;
};
