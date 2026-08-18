import { injectable } from "inversify";
import { IUsersRepository } from "../../../applications/interfaces/users.repository-interface";
import { UserDocument, UserModel } from "./user.model";

@injectable()
export class MongoUsersRepository implements IUsersRepository {
  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return await UserModel.findById(id).exec();
  }

  async findUserByLogin(login: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ login }).exec();
  }
  async findUserByEmail(email: string): Promise<UserDocument | null> {
    return await UserModel.findOne({ email }).exec();
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).exec();
  }

  async findUserByEmailConfirmationCode(code: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      "emailConfirmation.confirmationCode": code,
    }).exec();
  }

  async findUserByPasswordRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
    return await UserModel.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    }).exec();
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await UserModel.deleteOne({ _id: id }).exec();
    return deleteResult.deletedCount === 1;
  }
}