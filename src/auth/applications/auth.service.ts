import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { UserEntity } from "../../users/types/domain/user-entity.model";
import { add } from "date-fns";
import { RefreshTokenPayloadType } from "../types/refresh-session/refresh-token-payload.type";
import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { IUsersRepository } from "../../users/applications/interfaces/users.repository-interface";
import { IPasswordHashService } from "../interfaces/password-hash.service-interface";
import { IJwtService } from "../interfaces/jwt.service-interface";
import { IEmailService } from "../interfaces/email.service-interface";
import { IRefreshSessionRepository } from "../interfaces/refresh-session.repository-interface";
import { RefreshTokenSuccessViewModel } from "../types/refresh-session/refresh-token-success-view-model";
import { RotateRefreshTokenData } from "../types/refresh-session/data/rotate-refresh-token.data";
import { JwtPayloadType } from "../types/jwt-payload.type";
import { RegistrationInputDto } from "../dto/registration.input.dto";
import { CreateUserData } from "../../users/types/data/create-user.data";
import { emailTemplates } from "../adapters/email-templates";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input.dto";
import { MongoRefreshSessionRepository } from "../repositories/mongo-refresh-session.repository";
import { IAuthService } from "../interfaces/auth.service-interface";
import { randomUUID } from "node:crypto";

//!! поговорить про black и white list
const REFRESH_SESSION_LIFETIME_SECONDS = 20;
export class AuthService implements IAuthService {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordHashService: IPasswordHashService,
    private jwtService: IJwtService,
    private emailService: IEmailService,
    private refreshSessionRepository: IRefreshSessionRepository,
  ) {}

  private checkUserCredentials = async (
    loginOrEmail: string,
    password: string,
  ): Promise<UserEntity | null> => {
    const user = await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await this.passwordHashService.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return null;
    }
    if (!user.emailConfirmation?.isConfirmed) {
      return null;
    }

    return user;
  };

  async login(dto: LoginInputDto): Promise<Result<LoginSuccessViewModel>> {
    const { loginOrEmail, password } = dto;
    const user = await this.checkUserCredentials(loginOrEmail, password);
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: [{ field: "loginOrEmail", message: "Wrong credentials" }],
      };
    }
    const accessToken = await this.jwtService.createAccessToken({ userId: user.id });
    const refreshTokenPayload: RefreshTokenPayloadType = {
      userId: user.id,
      jti: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      tokenType: "refresh",
    };
    const refreshToken = await this.jwtService.createRefreshToken(refreshTokenPayload);
    const issuedAt = new Date();
    const expiresAt = add(issuedAt, { seconds: REFRESH_SESSION_LIFETIME_SECONDS });
    const refreshSessionData: CreateRefreshSessionData = {
      userId: user.id,
      sessionId: refreshTokenPayload.sessionId,
      isActive: true,
      refreshToken: {
        id: refreshTokenPayload.jti,
        issuedAt,
        expiresAt,
      },
    };

    await this.refreshSessionRepository.createRefreshSession(refreshSessionData);

    return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      errorsMessages: null,
    };
  }

  async refreshTokens(
    payload: RefreshTokenPayloadType,
  ): Promise<Result<RefreshTokenSuccessViewModel>> {
    const issuedAt = new Date();
    const expiresAt = add(issuedAt, { seconds: REFRESH_SESSION_LIFETIME_SECONDS });

    const rotateRefreshTokenData: RotateRefreshTokenData = {
      refreshToken: {
        id: randomUUID(),
        issuedAt,
        expiresAt,
      },
    };
    const isRefreshTokenRotated = await this.refreshSessionRepository.rotateRefreshTokenInSession(
      payload.sessionId,
      payload.jti,
      rotateRefreshTokenData,
    );
    if (!isRefreshTokenRotated) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }
    const newAccessTokenPayload: JwtPayloadType = { userId: payload.userId };
    const newRefreshTokenPayload: RefreshTokenPayloadType = {
      userId: payload.userId,
      jti: rotateRefreshTokenData.refreshToken.id,
      sessionId: payload.sessionId,
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

  async logout(currentRefreshToken: string): Promise<Result<null>> {
    const refreshTokenPayload = await this.jwtService.verifyRefreshToken(currentRefreshToken);
    if (!refreshTokenPayload) {
      return {
        status: ResultStatus.Unauthorized,
        data: null,
        errorsMessages: null,
      };
    }

    const isRefreshSessionInvalidated =
      await this.refreshSessionRepository.invalidateRefreshSessionBySessionId(
        refreshTokenPayload.sessionId,
      );
    if (!isRefreshSessionInvalidated) {
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

    const passwordHash = await this.passwordHashService.generateHash(password);
    const confirmationCode = crypto.randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    const newUser: CreateUserData = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode,
        expirationDate,
        isConfirmed: false,
      },
    };
    await this.usersRepository.createUser(newUser);

    try {
      await this.emailService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
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
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is incorrect" }],
      };
    }

    if (user.emailConfirmation.isConfirmed === true) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code has already been applied" }],
      };
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "code", message: "Confirmation code is expired" }],
      };
    }

    const isConfirmed = await this.usersRepository.confirmEmail(user.id);
    if (isConfirmed) {
      return {
        status: ResultStatus.Success,
        data: null,
        errorsMessages: null,
      };
    } else {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: null,
      };
    }
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
    if (user.emailConfirmation.isConfirmed === true) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "Email is already confirmed" }],
      };
    }

    const confirmationCode = crypto.randomUUID();
    const expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });

    const isUpdated = await this.usersRepository.updateEmailConfirmation(user.id, {
      confirmationCode,
      expirationDate,
    });

    if (isUpdated) {
      try {
        await this.emailService.sendEmail(
          email,
          confirmationCode,
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
}
