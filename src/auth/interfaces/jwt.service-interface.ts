import { JwtPayloadType } from "../types/jwt-payload.type";
import { RefreshTokenPayloadType } from "../types/auth-session/refresh-token-payload.type";

export interface IJwtService {
  createAccessToken(payload: JwtPayloadType): Promise<string>;
  verifyAccessToken(token: string): Promise<JwtPayloadType | null>;
  createRefreshToken(payload: RefreshTokenPayloadType): Promise<string>;
  verifyRefreshToken(token: string): Promise<RefreshTokenPayloadType | null>;
  decodeToken(token: string): Promise<any>;
}
