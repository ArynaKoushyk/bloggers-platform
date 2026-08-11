export type AuthSessionDbModel = {
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
