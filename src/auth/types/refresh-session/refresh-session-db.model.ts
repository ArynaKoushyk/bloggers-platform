export type RefreshSessionDbModel = {
  userId: string;
  jti: string;
  sessionId: string;
  issuedAt: Date;
  expiresAt: Date;
  isValid: boolean;
};
