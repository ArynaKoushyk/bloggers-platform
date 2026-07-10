import { WithId } from "mongodb";
import { RefreshSessionDbModel } from "../types/refresh-session/refresh-session-db.model";
import { RefreshSessionEntity } from "../types/refresh-session/domain/refresh-session-entity.model";

// TODO: Map refresh session DB model to domain entity.
export function mapRefreshSessionDbToEntity(
  refreshSession: WithId<RefreshSessionDbModel>,
): RefreshSessionEntity {
  return {
    id: refreshSession._id.toString(),
    userId: refreshSession.userId,
    jti: refreshSession.jti,
    sessionId: refreshSession.sessionId,
    issuedAt: refreshSession.issuedAt,
    expiresAt: refreshSession.expiresAt,
    isValid: refreshSession.isValid,
  };
}
