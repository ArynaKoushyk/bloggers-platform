import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { RotateRefreshTokenData } from "../types/refresh-session/data/rotate-refresh-token.data";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";
export interface IRefreshSessionRepository {
  createRefreshSession(data: CreateRefreshSessionData): Promise<string>;
  findRefreshSessionBySessionId(sessionId: string): Promise<RefreshSessionEntity | null>;
  findRefreshSessionByRefreshTokenId(refreshTokenId: string): Promise<RefreshSessionEntity | null>;
  rotateRefreshTokenInSession(
    sessionId: string,
    currentRefreshTokenId: string,
    data: RotateRefreshTokenData,
  ): Promise<boolean>;
  invalidateRefreshSessionBySessionId(sessionId: string): Promise<boolean>;
  invalidateRefreshSessionByRefreshTokenId(refreshTokenId: string): Promise<boolean>;
  invalidateRefreshSessionsByUserId(userId: string): Promise<boolean>;
}
