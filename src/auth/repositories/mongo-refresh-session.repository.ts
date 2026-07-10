import { refreshSessionsCollection } from "../../db/mongo.db";
import { RefreshSessionRepository } from "../applications/types/refresh-session.repository.type";
import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";
import { mapRefreshSessionDbToEntity } from "../mappers/map-refresh-session.db-to-entity.model";
import { RotateRefreshSessionData } from "../types/refresh-session/data/rotate-refresh-session.data";

export const mongoRefreshSessionRepository: RefreshSessionRepository = {
  async findRefreshSessionBySessionId(sessionId: string): Promise<RefreshSessionEntity | null> {
    const document = await refreshSessionsCollection.findOne({ sessionId: sessionId });
    if (!document) {
      return null;
    }
    return mapRefreshSessionDbToEntity(document);
  },

  async findRefreshSessionByJti(jti: string): Promise<RefreshSessionEntity | null> {
    const document = await refreshSessionsCollection.findOne({ jti: jti });
    if (!document) {
      return null;
    }
    return mapRefreshSessionDbToEntity(document);
  },

  async createRefreshSession(data: CreateRefreshSessionData): Promise<string> {
    const insertResult = await refreshSessionsCollection.insertOne(data);
    return insertResult.insertedId.toString();
  },

  async invalidateRefreshSessionByJti(jti: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
      { jti: jti, isValid: true },
      {
        $set: {
          isValid: false,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  },

  async rotateRefreshSession(
    sessionId: string,
    currentJti: string,
    data: RotateRefreshSessionData,
  ): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
      { sessionId: sessionId, jti: currentJti, isValid: true },
      {
        $set: {
          jti: data.jti,
          issuedAt: data.issuedAt,
          expiresAt: data.expiresAt,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  },

  async invalidateRefreshSessionBySessionId(sessionId: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateOne(
      { sessionId: sessionId, isValid: true },
      {
        $set: {
          isValid: false,
        },
      },
    );
    return updateResult.modifiedCount === 1;
  },

  async invalidateRefreshSessionsByUserId(userId: string): Promise<boolean> {
    const updateResult = await refreshSessionsCollection.updateMany(
      { userId: userId, isValid: true },
      {
        $set: {
          isValid: false,
        },
      },
    );
    return updateResult.modifiedCount > 0;
  },
};
