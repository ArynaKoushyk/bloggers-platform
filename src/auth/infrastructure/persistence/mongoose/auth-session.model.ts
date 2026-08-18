import mongoose, { Model } from "mongoose";
import { AuthSessionDbType } from "../../../types/auth-session/auth-session-db.model";
import { HydratedDocument } from "mongoose";
import { CreateAuthSessionData } from "../../../types/auth-session/data/create-auth-session.data";
import { RotateRefreshTokenData } from "../../../types/auth-session/data/rotate-refresh-token.data";
import {
  InvalidateAuthSessionDomainResult,
  InvalidateAuthSessionError,
  RotateRefreshTokenDomainResult,
  RotateRefreshTokenError,
} from "../../../types/auth-session/domain/auth-session.domain-result";
const { Schema, model } = mongoose;

export type AuthSessionDocument = HydratedDocument<AuthSessionDbType, AuthSessionMethods>;
type AuthSessionModelType = Model<AuthSessionDbType, {}, AuthSessionMethods> & AuthSessionStatics;

interface AuthSessionMethods {
  rotateRefreshToken(
    currentRefreshTokenId: string,
    currentDate: Date,
    data: RotateRefreshTokenData,
  ): RotateRefreshTokenDomainResult;

  isOwner(userId: string): boolean;
  invalidate(userId: string): InvalidateAuthSessionDomainResult;
}

type AuthSessionStatics = typeof AuthSessionEntity;

class AuthSessionEntity {
  private constructor() {}

  static createSession(data: CreateAuthSessionData): AuthSessionDocument {
    const session = new AuthSessionModel();
    session.userId = data.userId;
    session.deviceId = data.deviceId;
    session.deviceName = data.deviceName;
    session.ip = data.ip;
    session.refreshToken = data.refreshToken;
    session.isActive = true;
    return session;
  }

  rotateRefreshToken(
    this: AuthSessionDocument,
    currentRefreshTokenId: string,
    currentDate: Date,
    data: RotateRefreshTokenData,
  ): RotateRefreshTokenDomainResult {
    if (!this.isActive) {
      return {
        success: false,
        error: RotateRefreshTokenError.SessionInactive,
      };
    }
    if (this.refreshToken.id !== currentRefreshTokenId) {
      return {
        success: false,
        error: RotateRefreshTokenError.RefreshTokenMismatch,
      };
    }
    if (this.refreshToken.expiresAt <= currentDate) {
      return {
        success: false,
        error: RotateRefreshTokenError.RefreshTokenExpired,
      };
    }

    this.refreshToken.id = data.refreshToken.id;
    this.refreshToken.issuedAt = data.refreshToken.issuedAt;
    this.refreshToken.expiresAt = data.refreshToken.expiresAt;

    return {
      success: true,
    };
  }

  isOwner(this: AuthSessionDocument, userId: string): boolean {
    return this.userId === userId;
  }

  invalidate(this: AuthSessionDocument, userId: string): InvalidateAuthSessionDomainResult {
    if (!this.isOwner(userId)) {
      return {
        success: false,
        error: InvalidateAuthSessionError.NotOwner,
      };
    }

    if (!this.isActive) {
      return {
        success: false,
        error: InvalidateAuthSessionError.SessionAlreadyInactive,
      };
    }

    this.isActive = false;

    return {
      success: true,
    };
  }
}

const refreshTokenSchema = new Schema(
  {
    id: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    _id: false,
  },
);

const authSessionSchema = new Schema<
  AuthSessionDbType,
  AuthSessionModelType,
  AuthSessionMethods,
  {},
  {},
  AuthSessionStatics
>(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    refreshToken: { type: refreshTokenSchema, required: true },
  },
  { optimisticConcurrency: true },
);

authSessionSchema.loadClass(AuthSessionEntity);

export const AuthSessionModel = model<AuthSessionDbType, AuthSessionModelType>(
  "AuthSession",
  authSessionSchema,
  "authSessions",
);
