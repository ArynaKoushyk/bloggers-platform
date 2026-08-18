import { injectable } from "inversify";
import { AuthSessionDocument, AuthSessionModel } from "./auth-session.model";
import { IAuthSessionRepository } from "../../../interfaces/auth-session.repository-interface";

@injectable()
export class MongoAuthSessionRepository implements IAuthSessionRepository {
  async findAuthSessionByDeviceId(deviceId: string): Promise<AuthSessionDocument | null> {
    return await AuthSessionModel.findOne({ deviceId }).exec();
  }

  async findOtherActiveSessions(
    userId: string,
    currentDeviceId: string,
  ): Promise<AuthSessionDocument[]> {
    return AuthSessionModel.find({
      userId,
      deviceId: { $ne: currentDeviceId },
      isActive: true,
    }).exec();
  }

  async save(doc: AuthSessionDocument): Promise<void> {
    await doc.save();
  }
}
