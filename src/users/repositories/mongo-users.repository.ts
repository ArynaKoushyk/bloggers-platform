import { ObjectId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { UsersRepository } from "../applications/types/users.repository.type";
import { UserEntity } from "../types/domain/user-entity.model";
import { mapUserDbToEntity } from "../mappers/map-user.db-to-entity.model";
import { CreateUserData } from "../types/data/create-user.data";

export const mongoUsersRepository: UsersRepository = {
  async findUserById(id: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  },

  async findUserByLogin(login: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ login });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  },
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({ email });
    if (!document) {
      return null;
    }
    return mapUserDbToEntity(document);
  },
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity | null> {
    const document = await userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    if (!document) {

  
      return null;
    }
    return mapUserDbToEntity(document);
  },

  async createUser(data: CreateUserData): Promise<string> {
    const insertResult = await userCollection.insertOne(data);
    return insertResult.insertedId.toString();
  },

  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
