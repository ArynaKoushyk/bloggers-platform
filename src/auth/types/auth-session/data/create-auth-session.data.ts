export type CreateAuthSessionData = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  isActive: boolean;
  refreshToken: {
    id: string;
    issuedAt: Date;
    expiresAt: Date;
  };
};
