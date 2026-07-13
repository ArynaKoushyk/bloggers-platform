import { CreateUserData } from "../../types/data/create-user.data";
import { UpdateEmailConfirmation } from "../../types/data/update-email-confirmation.data";
import { UserEntity } from "../../types/domain/user-entity.model";

export interface IUsersRepository {
  findUserById(id: string): Promise<UserEntity | null>;
  findUserByLogin(login: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null>;
  createUser(data: CreateUserData): Promise<string>;
  deleteUser(id: string): Promise<boolean>;
  findUserByConfirmationCode(code: string): Promise<UserEntity | null>;
  confirmEmail(userId: string): Promise<boolean>;
  updateEmailConfirmation(userId: string, data: UpdateEmailConfirmation): Promise<boolean>;
};
