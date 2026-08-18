import { WithId } from "mongodb";
import { AuthSessionDbType } from "../types/auth-session/auth-session-db.model";

export interface IAuthSessionQueryRepository {
  findActiveAuthSessionsByUserId(userId: string): Promise<WithId<AuthSessionDbType>[]>;
}
