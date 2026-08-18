import { EmailConfirmationModel } from "./email-confirmation.model";
import { RecoveryPasswordModel } from "./recovery-password.model";

export type UserDbType = {
  login: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  emailConfirmation: EmailConfirmationModel;
  passwordRecovery: RecoveryPasswordModel;
};
