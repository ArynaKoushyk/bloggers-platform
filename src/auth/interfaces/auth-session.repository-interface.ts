import { AuthSessionDocument } from "../infrastructure/persistence/mongoose/auth-session.model";

export interface IAuthSessionRepository {
  findAuthSessionByDeviceId(deviceId: string): Promise<AuthSessionDocument | null>;

  findOtherActiveSessions(userId: string, currentDeviceId: string): Promise<AuthSessionDocument[]>;

  save(doc: AuthSessionDocument): Promise<void>;
}
