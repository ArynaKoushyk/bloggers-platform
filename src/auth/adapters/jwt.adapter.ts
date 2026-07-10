import { SETTINGS } from "../../core/settings/settings";
import { JwtService } from "../applications/types/jwt.service.type";
import { JwtPayloadType } from "../types/jwt-payload.type";
import jwt from "jsonwebtoken";
import { RefreshTokenPayloadType } from "../types/refresh-session/refresh-token-payload.type";

//!! использовать разные секреты для access и refresh
export const jwtAdapter: JwtService = {
  async createAccessToken(payload: JwtPayloadType): Promise<string> {
    return jwt.sign(payload, SETTINGS.ACCESS_TOKEN_SECRET, {
      expiresIn: SETTINGS.JWT_ACCESS_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    });
  },
  async verifyAccessToken(token: string): Promise<JwtPayloadType | null> {
    try {
      const payload = jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET, { algorithms: ["HS256"] });

      if (!payload || typeof payload !== "object" || typeof payload.userId !== "string") {
        return null;
      }

      return {
        userId: payload.userId,
      };
    } catch (error) {
      return null;
    }
  },

  async createRefreshToken(payload: RefreshTokenPayloadType): Promise<string> {
    return jwt.sign(payload, SETTINGS.REFRESH_TOKEN_SECRET, {
      expiresIn: SETTINGS.JWT_REFRESH_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    });
  },
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayloadType | null> {
    try {
      const payload = jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET, { algorithms: ["HS256"] });

      if (
        !payload ||
        typeof payload !== "object" ||
        typeof payload.userId !== "string" ||
        typeof payload.jti !== "string" ||
        typeof payload.sessionId !== "string" ||
        payload.tokenType !== "refresh"
      ) {
        return null;
      }

      return {
        userId: payload.userId,
        sessionId: payload.sessionId,
        jti: payload.jti,
        tokenType: "refresh",
      };
    } catch (error) {
      return null;
    }
  },
};
