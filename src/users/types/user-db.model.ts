import { EmailConfirmationModel } from "./email-confirmation.model";

export type UserDbModel = {
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationModel;
};
