import mongoose, { HydratedDocument, Model } from "mongoose";
import { RecoveryPasswordModel } from "../../../types/recovery-password.model";
import { EmailConfirmationModel } from "../../../types/email-confirmation.model";
import { CreateUserData } from "../../../types/data/create-user.data";
import { UserDbType } from "../../../types/user-db.model";
import {
  ConfirmEmailDomainResult,
  ConfirmEmailError,
} from "../../../types/domain/confirm-email.domain-result";
import {
  ResetPasswordDomainResult,
  ResetPasswordError,
} from "../../../types/domain/reset-password.domain-result";
import { RegisterUserData } from "../../../types/data/register-user.data";
const { Schema, model } = mongoose;

type UserModelType = Model<UserDbType, {}, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<UserDbType, UserMethods>;

interface UserMethods {
  confirmEmail(code: string, currentDate: Date): ConfirmEmailDomainResult;
  updateEmailConfirmationCode(code: string, expirationDate: Date): boolean;
  setPasswordRecoveryCode(code: string, expirationDate: Date): void;
  resetPassword(
    recoveryCode: string,
    passwordHash: string,
    currentDate: Date,
  ): ResetPasswordDomainResult;
}

type UserStatics = typeof UserEntity;

class UserEntity {
  private constructor() {}

  static createConfirmedUser(data: CreateUserData): UserDocument {
    const user = new UserModel();
    user.login = data.login;
    user.email = data.email;
    user.passwordHash = data.passwordHash;
    user.createdAt = new Date();
    user.emailConfirmation = {
      confirmationCode: null,
      expirationDate: null,
      isConfirmed: true,
    };
    user.passwordRecovery = {
      recoveryCode: null,
      expirationDate: null,
    };

    return user;
  }

  static registerUser(data: RegisterUserData): UserDocument {
    const user = new UserModel();
    user.login = data.login;
    user.email = data.email;
    user.passwordHash = data.passwordHash;
    user.createdAt = new Date();
    user.emailConfirmation = {
      confirmationCode: data.confirmationCode,
      expirationDate: data.confirmationCodeExpirationDate,
      isConfirmed: false,
    };
    user.passwordRecovery = {
      recoveryCode: null,
      expirationDate: null,
    };

    return user;
  }

  confirmEmail(this: UserDocument, code: string, currentDate: Date): ConfirmEmailDomainResult {
    if (this.emailConfirmation.isConfirmed) {
      return {
        success: false,
        error: ConfirmEmailError.AlreadyConfirmed,
      };
    }

    if (this.emailConfirmation.confirmationCode !== code) {
      return {
        success: false,
        error: ConfirmEmailError.InvalidCode,
      };
    }

    const expirationDate = this.emailConfirmation.expirationDate;

    if (!expirationDate || expirationDate <= currentDate) {
      return {
        success: false,
        error: ConfirmEmailError.ExpiredCode,
      };
    }

    this.emailConfirmation.isConfirmed = true;
    this.emailConfirmation.confirmationCode = null;
    this.emailConfirmation.expirationDate = null;

    return { success: true };
  }

  updateEmailConfirmationCode(this: UserDocument, code: string, expirationDate: Date): boolean {
    if (this.emailConfirmation.isConfirmed) {
      return false;
    }
    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = expirationDate;
    return true;
  }

  setPasswordRecoveryCode(this: UserDocument, recoveryCode: string, expirationDate: Date): void {
    this.passwordRecovery.recoveryCode = recoveryCode;
    this.passwordRecovery.expirationDate = expirationDate;
  }

  resetPassword(
    this: UserDocument,
    recoveryCode: string,
    passwordHash: string,
    currentDate: Date,
  ): ResetPasswordDomainResult {
    if (this.passwordRecovery.recoveryCode !== recoveryCode) {
      return {
        success: false,
        error: ResetPasswordError.InvalidRecoveryCode,
      };
    }

    const expirationDate = this.passwordRecovery.expirationDate;

    if (!expirationDate || expirationDate <= currentDate) {
      return {
        success: false,
        error: ResetPasswordError.ExpiredRecoveryCode,
      };
    }

    this.passwordHash = passwordHash;
    this.passwordRecovery.recoveryCode = null;
    this.passwordRecovery.expirationDate = null;

    return { success: true };
  }
}

const passwordRecoverySchema = new Schema<RecoveryPasswordModel>(
  {
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null },
  },
  {
    _id: false,
  },
);

const emailConfirmationSchema = new Schema<EmailConfirmationModel>(
  {
    confirmationCode: { type: String, default: null },
    expirationDate: { type: Date, default: null },
    isConfirmed: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
);
const userSchema = new Schema<UserDbType, UserModelType, UserMethods, {}, {}, UserStatics>(
  {
    login: { type: String, required: true, minLength: 1, maxLength: 250, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, minLength: 5, maxLength: 250, unique: true },
    createdAt: { type: Date, default: Date.now },
    emailConfirmation: { type: emailConfirmationSchema },
    passwordRecovery: { type: passwordRecoverySchema },
  },
  { optimisticConcurrency: true },
);

userSchema.loadClass(UserEntity);

export const UserModel = model<UserDbType, UserModelType>("users", userSchema);
