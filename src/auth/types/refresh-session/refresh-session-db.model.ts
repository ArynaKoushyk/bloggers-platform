export type RefreshSessionDbModel = {
  userId: string;
  sessionId: string;
  isActive: boolean;
  refreshToken: {
    id: string;
    issuedAt: Date;
    expiresAt: Date;
  };
};
