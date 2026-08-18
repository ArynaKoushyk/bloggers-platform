export enum ConfirmEmailError {
  AlreadyConfirmed = "already-confirmed",
  InvalidCode = "invalid-code",
  ExpiredCode = "expired-code",
}

export type ConfirmEmailSuccess = {
  success: true;
};

export type ConfirmEmailFailure = {
  success: false;
  error: ConfirmEmailError;
};

export type ConfirmEmailDomainResult = ConfirmEmailSuccess | ConfirmEmailFailure;
