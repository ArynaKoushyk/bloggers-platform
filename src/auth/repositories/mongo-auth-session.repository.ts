import { authSessionsCollection } from "../../db/mongo.db";
import { CreateAuthSessionData } from "../types/auth-session/data/create-auth-session.data";
import { AuthSessionEntity } from "../types/auth-session/domain/auth-session-entity.model";
import { mapAuthSessionDbToEntity } from "../mappers/map-auth-session.db-to-entity.model";
import { RotateRefreshTokenData } from "../types/auth-session/data/rotate-refresh-token.data";
import { IAuthSessionRepository } from "../interfaces/auth-session.repository-interface";
import { injectable } from "inversify";

@injectable()
export class MongoAuthSessionRepository implements IAuthSessionRepository {
  async findAuthSessionByDeviceId(deviceId: string): Promise<AuthSessionEntity | null> {
    const document = await authSessionsCollection.findOne({ deviceId });
    if (!document) {
      return null;
    }
    return mapAuthSessionDbToEntity(document);
  }

  async createAuthSession(data: CreateAuthSessionData): Promise<void> {
    await authSessionsCollection.insertOne(data);
  }

  async rotateRefreshToken(
    deviceId: string,
    currentRefreshTokenId: string,
    data: RotateRefreshTokenData,
  ): Promise<boolean> {
    const updateResult = await authSessionsCollection.updateOne(
      { deviceId, "refreshToken.id": currentRefreshTokenId, isActive: true },
      {
        $set: {
          "refreshToken.id": data.refreshToken.id,
          "refreshToken.issuedAt": data.refreshToken.issuedAt,
          "refreshToken.expiresAt": data.refreshToken.expiresAt,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async invalidateAuthSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const result = await authSessionsCollection.updateOne(
      {
        deviceId,
        userId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      },
    );
    return result.modifiedCount === 1;
  }
  async invalidateOtherAuthSessions(userId: string, currentDeviceId: string): Promise<boolean> {
    const result = await authSessionsCollection.updateMany(
      {
        userId,
        deviceId: { $ne: currentDeviceId },
        isActive: true,
      },
      {
        $set: {
          isActive: false,
        },
      },
    );
    return result.acknowledged;
  }
}
