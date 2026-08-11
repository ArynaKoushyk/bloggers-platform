import { ObjectId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { UserEntity } from "../types/domain/user-entity.model";
import { mapUserDbToEntity } from "../mappers/map-user.db-to-entity.model";
import { CreateUserData } from "../types/data/create-user.data";
import { UpdateEmailConfirmation } from "../types/data/update-email-confirmation.data";
import { injectable } from "inversify";
import { RecoveryPasswordModel } from "../types/recovery-password.model";
import { IUsersRepository } from "../applications/interfaces/users.repository-interface";

@injectable()
export class MongoUsersRepository implements IUsersRepository {
  async findUserById(id: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ login });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ email });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }

  async createUser(data: CreateUserData): Promise<string> {
    const insertResult = await userCollection.insertOne(data);
    return insertResult.insertedId.toString();
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }

  async findUserByEmailConfirmationCode(code: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }

  async markUserEmailAsConfirmed(userId: string): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
          "emailConfirmation.confirmationCode": null,
          "emailConfirmation.expirationDate": null,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async saveEmailConfirmationCode(userId: string, data: UpdateEmailConfirmation): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "emailConfirmation.confirmationCode": data.confirmationCode,
          "emailConfirmation.expirationDate": data.expirationDate,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async savePasswordRecoveryCode(userId: string, data: RecoveryPasswordModel): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          "passwordRecovery.recoveryCode": data.recoveryCode,
          "passwordRecovery.expirationDate": data.expirationDate,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async findUserByPasswordRecoveryCode(recoveryCode: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({
      "passwordRecovery.recoveryCode": recoveryCode,
    });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  }

  async resetPasswordAndInvalidateRecoveryCode(
    userId: string,
    recoveryCode: string,
    passwordHash: string,
  ): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      {
        _id: new ObjectId(userId),
        "passwordRecovery.recoveryCode": recoveryCode,
        "passwordRecovery.expirationDate": { $gt: new Date() },
      },

      {
        $set: {
          passwordHash: passwordHash,
          "passwordRecovery.recoveryCode": null,
          "passwordRecovery.expirationDate": null,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }
}
