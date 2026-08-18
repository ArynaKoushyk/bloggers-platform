import { WithId } from "mongodb";
import { injectable } from "inversify";
import { IAuthSessionQueryRepository } from "../../../interfaces/auth-session.query-repository-interface";
import { AuthSessionModel } from "./auth-session.model";
import { AuthSessionDbType } from "../../../types/auth-session/auth-session-db.model";

@injectable()
export class MongoAuthSessionQueryRepository implements IAuthSessionQueryRepository {
  async findActiveAuthSessionsByUserId(userId: string): Promise<WithId<AuthSessionDbType>[]> {
    return await AuthSessionModel.find({ userId, isActive: true })
      .lean<WithId<AuthSessionDbType>[]>()
      .exec();
  }
}
