export enum RotateRefreshTokenError {
  SessionInactive = "session-inactive",
  RefreshTokenMismatch = "refresh-token-mismatch",
  RefreshTokenExpired = "refresh-token-expired",
}

export type RotateRefreshTokenDomainResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: RotateRefreshTokenError;
    };

export enum InvalidateAuthSessionError {
  NotOwner = "not-owner",
  SessionAlreadyInactive = "session-already-inactive",
}

export type InvalidateAuthSessionDomainResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: InvalidateAuthSessionError;
    };
