import { WithId } from "mongodb";
import { AuthSessionDbModel } from "../types/auth-session/auth-session-db.model";
import { AuthSessionEntity } from "../types/auth-session/domain/auth-session-entity.model";

export function mapAuthSessionDbToEntity(
  authSession: WithId<AuthSessionDbModel>,
): AuthSessionEntity {
  return {
    userId: authSession.userId,
    deviceId: authSession.deviceId,
    deviceName: authSession.deviceName,
    ip: authSession.ip,
    isActive: authSession.isActive,
    refreshToken: {
      id: authSession.refreshToken.id,
      issuedAt: authSession.refreshToken.issuedAt,
      expiresAt: authSession.refreshToken.expiresAt,
    },
  };
}
