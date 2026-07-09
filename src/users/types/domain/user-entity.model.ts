import { EmailConfirmationModel } from "../email-confirmation.model";

export type UserEntity = {
  id: string;
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationModel;
};
