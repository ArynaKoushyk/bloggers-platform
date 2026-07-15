export type RefreshSessionEntity = {
  userId: string;
  deviceId: string;
  deviceName: string; //user-agent
  ip: string;
  isActive: boolean;
  refreshToken: {
    id: string;
    issuedAt: Date;
    expiresAt: Date;
  };
};
