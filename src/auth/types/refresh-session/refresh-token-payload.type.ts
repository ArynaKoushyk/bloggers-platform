export type RefreshTokenPayloadType = {
  userId: string;
  jti: string;
  sessionId: string;
  tokenType: "refresh";
};
