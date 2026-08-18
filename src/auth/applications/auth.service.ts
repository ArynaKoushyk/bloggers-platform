import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { add } from "date-fns";
import { RefreshTokenPayloadType } from "../types/auth-session/refresh-token-payload.type";
import { CreateAuthSessionData } from "../types/auth-session/data/create-auth-session.data";
import { IUsersRepository } from "../../users/applications/interfaces/users.repository-interface";
import { IPasswordHashService } from "../interfaces/password-hash.service-interface";
import { IJwtService } from "../interfaces/jwt.service-interface";
import { IEmailService } from "../interfaces/email.service-interface";
import { IAuthSessionRepository } from "../interfaces/auth-session.repository-interface";
import { RefreshTokenSuccessViewModel } from "../types/auth-session/refresh-token-success-view-model";
import { RotateRefreshTokenData } from "../types/auth-session/data/rotate-refresh-token.data";
import { JwtPayloadType } from "../types/jwt-payload.type";
import { RegistrationInputDto } from "../dto/registration.input.dto";
import { emailTemplates } from "../adapters/email-templates";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input.dto";
import { IAuthService } from "../interfaces/auth.service-interface";
import { randomUUID } from "node:crypto";
import { inject, injectable } from "inversify";
import { AUTH_SESSION_REPOSITORY } from "../../core/composition/di-tokens";
import {
  USERS_REPOSITORY,
  PASSWORD_HASH_SERVICE,
  JWT_SERVICE,
  EMAIL_SERVICE,
} from "../../core/composition/di-tokens";
import { DeviceInfo } from "../types/device.info-type";
import { PasswordRecoveryInputDto } from "../dto/password-recovery.input.dto";
import { NewPasswordRecoveryInputDto } from "../dto/new-password-recovery.input.dto";
import { AuthSessionModel } from "../infrastructure/persistence/mongoose/auth-session.model";
import {
  UserDocument,
  UserModel,
} from "../../users/infrastructure/persistence/mongoose/user.model";
import { RegisterUserData } from "../../users/types/data/register-user.data";
import { InvalidateAuthSessionError } from "../types/auth-session/domain/auth-session.domain-result";
import { ConfirmEmailError } from "../../users/types/domain/confirm-email.domain-result";
import { SETTINGS } from "../../core/settings/settings";

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(USERS_REPOSITORY) private usersRepository: IUsersRepository,
    @inject(PASSWORD_HASH_SERVICE) private passwordHashService: IPasswordHashService,
    @inject(JWT_SERVICE) private jwtService: IJwtService,
    @inject(EMAIL_SERVICE) private emailService: IEmailService,
    @inject(AUTH_SESSION_REPOSITORY) private authSessionRepository: IAuthSessionRepository,
  ) {}

  private findUserWithValidCredentials = async (
    loginOrEmail: string,
    password: string,
  ): Promise<UserDocument | null> => {
    const userByLoginOrEmail = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!userByLoginOrEmail) {
      return null;
    }
    const isPasswordCorrect = await this.passwordHashService.compare(
      password,
      userByLoginOrEmail.passwordHash,
    );
    if (!isPasswordCorrect) {
      return null;
    }
    if (!userByLoginOrEmail.emailConfirmation?.isConfirmed) {
      return null;
    }

    return userByLoginOrEmail;
  };

  async login(dto: LoginInputDto, deviceInfo: DeviceInfo): Promise<Result<LoginSuccessViewModel>> {
    const { loginOrEmail, password } = dto;
    const authenticatedUser = await this.findUserWithValidCredentials(loginOrEmail, password);
    if (!authenticatedUser) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: [{ field: "loginOrEmail", message: "Wrong credentials" }],
      };
    }
    const accessToken = await this.jwtService.createAccessToken({
      userId: authenticatedUser.id,
    });
    const refreshTokenPayload: RefreshTokenPayloadType = {
      userId: authenticatedUser.id,
      jti: randomUUID(),
      deviceId: randomUUID(),
      tokenType: "refresh",
    };
    const refreshToken = await this.jwtService.createRefreshToken(refreshTokenPayload);
    const refreshTokenIssuedAt = new Date();
    const refreshTokenExpiresAt = add(refreshTokenIssuedAt, {
      seconds: SETTINGS.REFRESH_TOKEN_LIFETIME_SECONDS,
    });

    const newAuthSessionData: CreateAuthSessionData = {
      userId: authenticatedUser.id,
      deviceId: refreshTokenPayload.deviceId,
      deviceName: deviceInfo.deviceName,
      ip: deviceInfo.ip,
      refreshToken: {
        id: refreshTokenPayload.jti,
        issuedAt: refreshTokenIssuedAt,
        expiresAt: refreshTokenExpiresAt,
      },
    };
    const session = AuthSessionModel.createSession(newAuthSessionData);
    await this.authSessionRepository.save(session);

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      errorsMessages: null,
    };
  }

  async refreshTokens(
    currentRefreshTokenPayload: RefreshTokenPayloadType,
  ): Promise<Result<RefreshTokenSuccessViewModel>> {
    const newRefreshTokenIssuedAt = new Date();
    const newRefreshTokenExpiresAt = add(newRefreshTokenIssuedAt, {
      seconds: SETTINGS.REFRESH_TOKEN_LIFETIME_SECONDS,
    });

    const session = await this.authSessionRepository.findAuthSessionByDeviceId(
      currentRefreshTokenPayload.deviceId,
    );

    if (!session || !session.isOwner(currentRefreshTokenPayload.userId)) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    const currentDate = new Date();
    const refreshTokenData: RotateRefreshTokenData = {
      refreshToken: {
        id: randomUUID(),
        issuedAt: newRefreshTokenIssuedAt,
        expiresAt: newRefreshTokenExpiresAt,
      },
    };
    const rotationResult = session.rotateRefreshToken(
      currentRefreshTokenPayload.jti,
      currentDate,
      refreshTokenData,
    );
    if (!rotationResult.success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    await this.authSessionRepository.save(session);

    const newAccessTokenPayload: JwtPayloadType = {
      userId: currentRefreshTokenPayload.userId,
    };
    const newRefreshTokenPayload: RefreshTokenPayloadType = {
      userId: currentRefreshTokenPayload.userId,
      jti: refreshTokenData.refreshToken.id,
      deviceId: currentRefreshTokenPayload.deviceId,
      tokenType: "refresh",
    };
    const newAccessToken = await this.jwtService.createAccessToken(newAccessTokenPayload);
    const newRefreshToken = await this.jwtService.createRefreshToken(newRefreshTokenPayload);

    return {
      status: ResultStatus.Success,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      errorsMessages: null,
    };
  }

  async invalidateAuthSession(userId: string, deviceId: string): Promise<Result<null>> {
    const authSession = await this.authSessionRepository.findAuthSessionByDeviceId(deviceId);
    if (!authSession) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }

    const invalidateResult = authSession.invalidate(userId);

    if (!invalidateResult.success) {
      if (invalidateResult.error === InvalidateAuthSessionError.NotOwner) {
        return {
          status: ResultStatus.Forbidden,
          data: null,
          errorsMessages: null,
        };
      } else if (invalidateResult.error === InvalidateAuthSessionError.SessionAlreadyInactive) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }
    }

    await this.authSessionRepository.save(authSession);

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async invalidateOtherAuthSessions(
    userId: string,
    currentDeviceId: string,
  ): Promise<Result<null>> {
    const otherSessions = await this.authSessionRepository.findOtherActiveSessions(
      userId,
      currentDeviceId,
    );

    for (const session of otherSessions) {
      session.invalidate(userId);
    }

    await Promise.all(otherSessions.map((session) => this.authSessionRepository.save(session)));

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async logout(userId: string, deviceId: string): Promise<Result<null>> {
    const authSession = await this.authSessionRepository.findAuthSessionByDeviceId(deviceId);
    if (!authSession) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    if (authSession.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorsMessages: null,
      };
    }
    const invalidateResult = authSession.invalidate(userId);

    if (!invalidateResult.success) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    await this.authSessionRepository.save(authSession);
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async registration(dto: RegistrationInputDto): Promise<Result<null>> {
    const { login, password, email } = dto;
    const existingUserByLogin = await this.usersRepository.findUserByLogin(login);
    if (existingUserByLogin) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "login", message: "Login already exists" }],
      };
    }

    const existingUserByEmail = await this.usersRepository.findUserByEmail(email);
    if (existingUserByEmail) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email already exists" }],
      };
    }

    const newUserPasswordHash = await this.passwordHashService.generateHash(password);
    const emailConfirmationCode = randomUUID();
    const emailConfirmationExpiresAt = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    const newUser: RegisterUserData = {
      login,
      email,
      passwordHash: newUserPasswordHash,
      confirmationCode: emailConfirmationCode,
      confirmationCodeExpirationDate: emailConfirmationExpiresAt,
    };
    const user = UserModel.registerUser(newUser);
    await this.usersRepository.save(user);

    try {
      await this.emailService.sendEmail(
        newUser.email,
        emailConfirmationCode,
        emailTemplates.registrationEmail,
      );
    } catch (error) {
      console.error(error);
    }

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async confirmRegistration(dto: RegistrationConfirmationInputDto): Promise<Result<null>> {
    const { code } = dto;
    const user = await this.usersRepository.findUserByEmailConfirmationCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is incorrect" }],
      };
    }

    const currentDate = new Date();
    const result = user.confirmEmail(code, currentDate);

    if (!result.success) {
      if (result.error === ConfirmEmailError.AlreadyConfirmed) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "code", message: "Email is already confirmed" }],
        };
      }

      if (result.error === ConfirmEmailError.InvalidCode) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "code", message: "Confirmation code is incorrect" }],
        };
      }

      if (result.error === ConfirmEmailError.ExpiredCode) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "code", message: "Confirmation code is expired" }],
        };
      }

      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is invalid" }],
      };
    }

    await this.usersRepository.save(user);
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async resendRegistrationEmail(dto: RegistrationEmailResendingInputDto): Promise<Result<null>> {
    const { email } = dto;
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email is not registered" }],
      };
    }
    const newEmailConfirmationCode = randomUUID();
    const newEmailConfirmationExpiresAt = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    const isUpdated = user.updateEmailConfirmationCode(
      newEmailConfirmationCode,
      newEmailConfirmationExpiresAt,
    );

    if (!isUpdated) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email is already confirmed" }],
      };
    }

    await this.usersRepository.save(user);

    try {
      await this.emailService.sendEmail(
        email,
        newEmailConfirmationCode,
        emailTemplates.registrationEmail,
      );
    } catch (error) {
      console.error(error);
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async sendPasswordRecoveryEmail(dto: PasswordRecoveryInputDto): Promise<Result<null>> {
    const { email } = dto;
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    }

    const recoveryCode = randomUUID();
    const recoveryCodeExpiresAt = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    userByEmail.setPasswordRecoveryCode(recoveryCode, recoveryCodeExpiresAt);

    await this.usersRepository.save(userByEmail);

    try {
      await this.emailService.sendEmail(email, recoveryCode, emailTemplates.passwordRecoveryEmail);
    } catch (error) {
      console.error(error);
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async resetPasswordWithRecoveryCode(dto: NewPasswordRecoveryInputDto): Promise<Result<null>> {
    const { newPassword, recoveryCode } = dto;
    const userWithRecoveryCode =
      await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);
    if (!userWithRecoveryCode) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [
          {
            field: "recoveryCode",
            message: "Recovery code is invalid or expired",
          },
        ],
      };
    }

    const newPasswordHash = await this.passwordHashService.generateHash(newPassword);
    const resetResult = userWithRecoveryCode.resetPassword(
      recoveryCode,
      newPasswordHash,
      new Date(),
    );

    if (!resetResult.success) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [
          {
            field: "recoveryCode",
            message: "Recovery code is invalid or expired",
          },
        ],
      };
    }

    await this.usersRepository.save(userWithRecoveryCode);
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }
}
