// TODO: Define create refresh session data.
export type CreateRefreshSessionData = {
  userId: string;
  jti: string;
  sessionId: string;
  issuedAt: Date;
  expiresAt: Date;
  isValid: boolean;
};
