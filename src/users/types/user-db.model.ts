import { EmailConfirmationModel } from "./email-confirmation.model";
import { RecoveryPasswordModel } from "./recovery-password.model";

export type UserDbModel = {
  login: string;
  passwordHash: string;
  email: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationModel;
passwordRecovery: RecoveryPasswordModel
};
