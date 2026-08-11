export type RefreshTokenPayloadType = {
  userId: string;
  jti: string;
  deviceId: string;
  tokenType: "refresh";
};
