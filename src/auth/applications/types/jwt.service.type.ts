import { JwtPayloadType } from "../../types/jwt-payload.type";
import { RefreshTokenPayloadType } from "../../types/refresh-session/refresh-token-payload.type";

export type JwtService = {
  createAccessToken(payload: JwtPayloadType): Promise<string>;
  verifyAccessToken(token: string): Promise<JwtPayloadType | null>;
  createRefreshToken(payload: RefreshTokenPayloadType): Promise<string>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayloadType | null>;
};
