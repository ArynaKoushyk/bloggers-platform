// TODO: Define refresh session domain entity.
export type RefreshSessionEntity = {
  id: string;
  userId: string;
  jti: string;
  sessionId: string;
  issuedAt: Date;
  expiresAt: Date;
  isValid: boolean;
};
