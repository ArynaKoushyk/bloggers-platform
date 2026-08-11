import { CreateUserData } from "../../types/data/create-user.data";
import { UpdateEmailConfirmation } from "../../types/data/update-email-confirmation.data";
import { UserEntity } from "../../types/domain/user-entity.model";
import { RecoveryPasswordModel } from "../../types/recovery-password.model";

export interface IUsersRepository {
  findUserById(id: string): Promise<UserEntity | null>;
  findUserByLogin(login: string): Promise<UserEntity | null>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null>;
  createUser(data: CreateUserData): Promise<string>;
  deleteUser(id: string): Promise<boolean>;
  findUserByEmailConfirmationCode(code: string): Promise<UserEntity | null>;
  markUserEmailAsConfirmed(userId: string): Promise<boolean>;
  saveEmailConfirmationCode(userId: string, data: UpdateEmailConfirmation): Promise<boolean>;
  savePasswordRecoveryCode(userId: string, data: RecoveryPasswordModel): Promise<boolean>;
  findUserByPasswordRecoveryCode(recoveryCode: string): Promise<UserEntity | null>;
  resetPasswordAndInvalidateRecoveryCode(
    userId: string,
    recoveryCode: string,
    passwordHash: string,
  ): Promise<boolean>;
}
