export enum ResetPasswordError {
  InvalidRecoveryCode = "invalid-recovery-code",
  ExpiredRecoveryCode = "expired-recovery-code",
}

export type ResetPasswordDomainResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: ResetPasswordError;
    };
