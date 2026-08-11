import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { UserEntity } from "../../users/types/domain/user-entity.model";
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
import { CreateUserData } from "../../users/types/data/create-user.data";
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
const AUTH_SESSION_LIFETIME_SECONDS = 20;
@injectable()
//!! поговорить про black и white list
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
  ): Promise<UserEntity | null> => {
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
      seconds: AUTH_SESSION_LIFETIME_SECONDS,
    });

    const newAuthSessionData: CreateAuthSessionData = {
      userId: authenticatedUser.id,
      deviceId: refreshTokenPayload.deviceId,
      deviceName: deviceInfo.deviceName,
      ip: deviceInfo.ip,
      isActive: true,
      refreshToken: {
        id: refreshTokenPayload.jti,
        issuedAt: refreshTokenIssuedAt,
        expiresAt: refreshTokenExpiresAt,
      },
    };

    await this.authSessionRepository.createAuthSession(newAuthSessionData);

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
      seconds: AUTH_SESSION_LIFETIME_SECONDS,
    });

    const refreshTokenRotationData: RotateRefreshTokenData = {
      refreshToken: {
        id: randomUUID(),
        issuedAt: newRefreshTokenIssuedAt,
        expiresAt: newRefreshTokenExpiresAt,
      },
    };
    const isRefreshTokenRotated = await this.authSessionRepository.rotateRefreshToken(
      currentRefreshTokenPayload.deviceId,
      currentRefreshTokenPayload.jti,
      refreshTokenRotationData,
    );
    if (!isRefreshTokenRotated) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    const newAccessTokenPayload: JwtPayloadType = {
      userId: currentRefreshTokenPayload.userId,
    };
    const newRefreshTokenPayload: RefreshTokenPayloadType = {
      userId: currentRefreshTokenPayload.userId,
      jti: refreshTokenRotationData.refreshToken.id,
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
    if (authSession.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        data: null,
        errorsMessages: null,
      };
    }
    const isAuthSessionInvalidated =
      await this.authSessionRepository.invalidateAuthSessionByUserIdAndDeviceId(userId, deviceId);
    if (!isAuthSessionInvalidated) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
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
    const wereOtherAuthSessionsInvalidated =
      await this.authSessionRepository.invalidateOtherAuthSessions(userId, currentDeviceId);
    if (!wereOtherAuthSessionsInvalidated) {
      return {
        status: ResultStatus.NotFound,
        data: null,
        errorsMessages: null,
      };
    }
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async logout(userId: string, deviceId: string): Promise<Result<null>> {
    const isAuthSessionInvalidated =
      await this.authSessionRepository.invalidateAuthSessionByUserIdAndDeviceId(userId, deviceId);
    if (!isAuthSessionInvalidated) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
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

    const newUser: CreateUserData = {
      login,
      email,
      passwordHash: newUserPasswordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: emailConfirmationCode,
        expirationDate: emailConfirmationExpiresAt,
        isConfirmed: false,
      },
      passwordRecovery: {
        recoveryCode: null,
        expirationDate: null,
      },
    };
    await this.usersRepository.createUser(newUser);

    try {
      await this.emailService.sendEmail(
        newUser.email,
        emailConfirmationCode,
        emailTemplates.registrationEmail,
      );
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Confirmation email could not be sent" }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }

  async confirmRegistration(dto: RegistrationConfirmationInputDto): Promise<Result<null>> {
    const { code } = dto;
    const userWithConfirmationCode =
      await this.usersRepository.findUserByEmailConfirmationCode(code);
    if (!userWithConfirmationCode) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is incorrect" }],
      };
    }

    if (userWithConfirmationCode.emailConfirmation.isConfirmed === true) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code has already been applied" }],
      };
    }

    if (
      !userWithConfirmationCode.emailConfirmation.expirationDate ||
      userWithConfirmationCode.emailConfirmation.expirationDate < new Date()
    ) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is expired" }],
      };
    }

    const isUserEmailConfirmed = await this.usersRepository.markUserEmailAsConfirmed(
      userWithConfirmationCode.id,
    );
    if (isUserEmailConfirmed) {
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    } else {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [
          {
            field: "code",
            message: "Confirmation code could not be applied",
          },
        ],
      };
    }
  }
  async resendRegistrationEmail(dto: RegistrationEmailResendingInputDto): Promise<Result<null>> {
    const { email } = dto;
    const userByEmail = await this.usersRepository.findUserByEmail(email);
    if (!userByEmail) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email is not registered" }],
      };
    }
    if (userByEmail.emailConfirmation.isConfirmed === true) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email is already confirmed" }],
      };
    }

    const newEmailConfirmationCode = randomUUID();
    const newEmailConfirmationExpiresAt = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    const isEmailConfirmationCodeSaved = await this.usersRepository.saveEmailConfirmationCode(
      userByEmail.id,
      {
        confirmationCode: newEmailConfirmationCode,
        expirationDate: newEmailConfirmationExpiresAt,
      },
    );

    if (isEmailConfirmationCodeSaved) {
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
    return {
      status: ResultStatus.BadRequest,
      data: null,
      errorsMessages: [
        {
          field: "email",
          message: "Confirmation email could not be resent",
        },
      ],
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

    const isPasswordRecoveryCodeSaved = await this.usersRepository.savePasswordRecoveryCode(
      userByEmail.id,
      {
        recoveryCode,
        expirationDate: recoveryCodeExpiresAt,
      },
    );

    if (isPasswordRecoveryCodeSaved) {
      try {
        await this.emailService.sendEmail(
          email,
          recoveryCode,
          emailTemplates.passwordRecoveryEmail,
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
    return {
      status: ResultStatus.BadRequest,
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
    if (
      !userWithRecoveryCode.passwordRecovery.expirationDate ||
      userWithRecoveryCode.passwordRecovery.expirationDate < new Date()
    ) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "recoveryCode", message: "Recovery code is expired" }],
      };
    }

    const newPasswordHash = await this.passwordHashService.generateHash(newPassword);
    const isPasswordReset = await this.usersRepository.resetPasswordAndInvalidateRecoveryCode(
      userWithRecoveryCode.id,
      recoveryCode,
      newPasswordHash,
    );
    if (!isPasswordReset) {
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
    return {
      status: ResultStatus.Success,
      data: null,
      errorsMessages: null,
    };
  }
}
