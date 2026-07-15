import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { RotateRefreshTokenData } from "../types/refresh-session/data/rotate-refresh-token.data";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";
export interface IRefreshSessionRepository {
  createRefreshSession(data: CreateRefreshSessionData): Promise<string>;
  findRefreshSessionByDeviceId(deviceId: string): Promise<RefreshSessionEntity | null>;
  findRefreshSessionByRefreshTokenId(refreshTokenId: string): Promise<RefreshSessionEntity | null>;
  rotateRefreshTokenInSession(
    deviceId: string,
    currentRefreshTokenId: string,
    data: RotateRefreshTokenData,
  ): Promise<boolean>;
  invalidateRefreshSessionByDeviceId(deviceId: string): Promise<boolean>;
  invalidateRefreshSessionByRefreshTokenId(refreshTokenId: string): Promise<boolean>;
  invalidateRefreshSessionsByUserId(userId: string): Promise<boolean>;
}
