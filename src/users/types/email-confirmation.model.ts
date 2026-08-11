export type EmailConfirmationModel = {
  confirmationCode: string | null;
  expirationDate: Date | null;
  isConfirmed: boolean;
};
