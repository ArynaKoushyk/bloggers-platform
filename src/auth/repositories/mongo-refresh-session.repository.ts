import { refreshSessionsCollection } from "../../db/mongo.db";
import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";
import { mapRefreshSessionDbToEntity } from "../mappers/map-refresh-session.db-to-entity.model";
import { RotateRefreshTokenData } from "../types/refresh-session/data/rotate-refresh-token.data";
import { IRefreshSessionRepository } from "../interfaces/refresh-session.repository-interface";
import { injectable } from "inversify";

@injectable()
export class MongoRefreshSessionRepository implements IRefreshSessionRepository {
  async findRefreshSessionByDeviceId(deviceId: string): Promise<RefreshSessionEntity | null> {
    const document = await refreshSessionsCollection.findOne({ deviceId });
    if (!document) {
      return null;
    }
    return mapRefreshSessionDbToEntity(document);
  }

  async findRefreshSessionByRefreshTokenId(
    refreshTokenId: string,
  ): Promise<RefreshSessionEntity | null> {
    const document = await refreshSessionsCollection.findOne({ "refreshToken.id": refreshTokenId });
    if (!document) {
      return null;
    }
    return mapRefreshSessionDbToEntity(document);
  }

  async createRefreshSession(data: CreateRefreshSessionData): Promise<string> {
    const insertResult = await refreshSessionsCollection.insertOne(data);
    return insertResult.insertedId.toString();
  }

  async invalidateRefreshSessionByRefreshTokenId(refreshTokenId: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
      { "refreshToken.id": refreshTokenId, isActive: true },
      {
        $set: {
          isActive: false,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async rotateRefreshTokenInSession(
    deviceId: string,
    currentRefreshTokenId: string,
    data: RotateRefreshTokenData,
  ): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
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

  async invalidateRefreshSessionByDeviceId(deviceId: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
      { deviceId, isActive: true },
      {
        $set: {
          isActive: false,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  }

  async invalidateRefreshSessionsByUserId(userId: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateMany(
      { userId: userId, isActive: true },
      {
        $set: {
          isActive: false,
        },
      },
    );
    return updateResult.modifiedCount > 0;
  }
}
