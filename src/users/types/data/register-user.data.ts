export type RegisterUserData = {
  login: string;
  passwordHash: string;
  email: string;
  confirmationCode: string;
  confirmationCodeExpirationDate: Date;
};
