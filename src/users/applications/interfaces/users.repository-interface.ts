import { UserDocument } from "../../infrastructure/persistence/mongoose/user.model";

export interface IUsersRepository {
  findUserById(id: string): Promise<UserDocument | null>;
  findUserByLogin(login: string): Promise<UserDocument | null>;
  findUserByEmail(email: string): Promise<UserDocument | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null>;
  deleteUser(id: string): Promise<boolean>;
  findUserByEmailConfirmationCode(code: string): Promise<UserDocument | null>;
  save(user: UserDocument): Promise<void>;
  findUserByPasswordRecoveryCode(recoveryCode: string): Promise<UserDocument | null>;
}
