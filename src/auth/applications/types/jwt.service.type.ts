import { JwtPayloadType } from "../../types/jwt-payload.type";

export type JwtService = {
  createAccessToken(payload: JwtPayloadType): Promise<string>;
  verifyAccessToken(token: string): Promise<JwtPayloadType | null>;
};
