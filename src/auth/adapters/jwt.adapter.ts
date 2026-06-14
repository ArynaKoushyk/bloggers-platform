import { SETTINGS } from "../../core/settings/settings";
import { JwtService } from "../applications/types/jwt.service.type";
import { JwtPayloadType } from "../types/jwt-payload.type";
import jwt from "jsonwebtoken";

export const jwtAdapter: JwtService = {
  async createAccessToken(payload: JwtPayloadType): Promise<string> {
    return jwt.sign(payload, SETTINGS.JWT_SECRET, {
      expiresIn: SETTINGS.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  },
  async verifyAccessToken(token: string): Promise<JwtPayloadType | null> {
    try {
      const payload = jwt.verify(token, SETTINGS.JWT_SECRET);

      if (!payload || typeof payload !== "object" || typeof payload.userId !== "string") {
        return null;
      }

      return payload as JwtPayloadType;
    } catch (error) {
      return null;
    }
  },
};
