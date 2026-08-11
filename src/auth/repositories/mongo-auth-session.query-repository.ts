import { WithId } from "mongodb";
import { injectable } from "inversify";
import { IAuthSessionQueryRepository } from "../interfaces/auth-session.query-repository-interface";
import { AuthSessionDbModel } from "../types/auth-session/auth-session-db.model";
import { authSessionsCollection } from "../../db/mongo.db";

@injectable()
export class MongoAuthSessionQueryRepository implements IAuthSessionQueryRepository {
  async findActiveAuthSessionsByUserId(userId: string): Promise<WithId<AuthSessionDbModel>[]> {
    return await authSessionsCollection.find({ userId, isActive: true }).toArray();
  }
}
