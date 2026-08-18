export type CreateAuthSessionData = {
  userId: string;
  deviceId: string;
  deviceName: string;
  ip: string;
  refreshToken: {
    id: string;
    issuedAt: Date;
    expiresAt: Date;
  };
};
