import { CreateRefreshSessionData } from "../../types/refresh-session/data/create-refresh-session.data";
import { RotateRefreshSessionData } from "../../types/refresh-session/data/rotate-refresh-session.data";
import { RefreshSessionEntity } from "../../types/refresh-session/domain/refresh-session-entity.model";

// TODO: Define refresh session repository contract.
export type RefreshSessionRepository = {
  createRefreshSession(data: CreateRefreshSessionData): Promise<string>;
  findRefreshSessionBySessionId(sessionId: string): Promise<RefreshSessionEntity | null>;
  findRefreshSessionByJti(jti: string): Promise<RefreshSessionEntity | null>;
  rotateRefreshSession(
    sessionId: string,
    currentJti: string,
    data: RotateRefreshSessionData,
  ): Promise<boolean>;
  invalidateRefreshSessionBySessionId(sessionId: string): Promise<boolean>;
  invalidateRefreshSessionByJti(jti: string): Promise<boolean>;
  invalidateRefreshSessionsByUserId(userId: string): Promise<boolean>;
};
