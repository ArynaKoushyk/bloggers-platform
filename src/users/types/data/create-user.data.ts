import { EmailConfirmationModel } from "../email-confirmation.model";

export type CreateUserData = {
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationModel;
};
