import { WithId } from "mongodb";
import { RefreshSessionDbModel } from "../types/refresh-session/refresh-session-db.model";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";

export function mapRefreshSessionDbToEntity(
  refreshSession: WithId<RefreshSessionDbModel>,
): RefreshSessionEntity {
  return {
    userId: refreshSession.userId,
    deviceId: refreshSession.deviceId,
    deviceName: refreshSession.deviceName,
    ip: refreshSession.ip,
    isActive: refreshSession.isActive,
    refreshToken: {
      id: refreshSession.refreshToken.id,
      issuedAt: refreshSession.refreshToken.issuedAt,
      expiresAt: refreshSession.refreshToken.expiresAt,
    },
  };
}
