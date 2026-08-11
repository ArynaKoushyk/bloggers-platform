import { CreateAuthSessionData } from "../types/auth-session/data/create-auth-session.data";
import { RotateRefreshTokenData } from "../types/auth-session/data/rotate-refresh-token.data";
import { AuthSessionEntity } from "../types/auth-session/domain/auth-session-entity.model";
export interface IAuthSessionRepository {
  createAuthSession(data: CreateAuthSessionData): Promise<void>;
  findAuthSessionByDeviceId(deviceId: string): Promise<AuthSessionEntity | null>;
  rotateRefreshToken(
    deviceId: string,
    currentRefreshTokenId: string,
    data: RotateRefreshTokenData,
  ): Promise<boolean>;
  invalidateAuthSessionByUserIdAndDeviceId(userId: string, deviceId: string): Promise<boolean>;
  invalidateOtherAuthSessions(userId: string, currentDeviceId: string): Promise<boolean>;
}
