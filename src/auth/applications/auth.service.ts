import { AuthService } from "./types/auth.service.type";
import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { UsersRepository } from "../../users/applications/types/users.repository.type";
import { PasswordHashService } from "./types/password-hash.service.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { JwtService } from "./types/jwt.service.type";
import { UserEntity } from "../../users/types/domain/user-entity.model";
import { RegistrationInputDto } from "../dto/registration.input.dto";
import { CreateUserData } from "../../users/types/data/create-user.data";
import { add } from "date-fns";
import { EmailService } from "./types/email.service.type";
import { emailTemplates } from "../adapters/email-templates";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input.dto";
import { RefreshTokenPayloadType } from "../types/refresh-session/refresh-token-payload.type";
import { RefreshSessionRepository } from "./types/refresh-session.repository.type";
import { CreateRefreshSessionData } from "../types/refresh-session/data/create-refresh-session.data";
import { RotateRefreshSessionData } from "../types/refresh-session/data/rotate-refresh-session.data";
import { JwtPayloadType } from "../types/jwt-payload.type";
import { RefreshTokenSuccessViewModel } from "../types/refresh-session/refresh-token-success-view-model";

//!! поговорить про black и white list
const REFRESH_SESSION_LIFETIME_SECONDS = 20;

export const createAuthService = (
  usersRepository: UsersRepository,
  passwordHashService: PasswordHashService,
  jwtService: JwtService,
  emailService: EmailService,
  refreshSessionRepository: RefreshSessionRepository,
): AuthService => {
  const checkUserCredentials = async (
    loginOrEmail: string,
    password: string,
  ): Promise<UserEntity | null> => {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await passwordHashService.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return null;
    }
    if (!user.emailConfirmation?.isConfirmed) {
      return null;
    }

    return user;
  };

  return {
    async login(dto: LoginInputDto): Promise<Result<LoginSuccessViewModel>> {
      const { loginOrEmail, password } = dto;
      const user = await checkUserCredentials(loginOrEmail, password);
      if (!user) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: [{ field: "loginOrEmail", message: "Wrong credentials" }],
        };
      }
      const accessToken = await jwtService.createAccessToken({ userId: user.id });
      const refreshTokenPayload: RefreshTokenPayloadType = {
        userId: user.id,
        jti: crypto.randomUUID(),
        sessionId: crypto.randomUUID(),
        tokenType: "refresh",
      };
      const refreshToken = await jwtService.createRefreshToken(refreshTokenPayload);
      const issuedAt = new Date();
      const expiresAt = add(issuedAt, { seconds: REFRESH_SESSION_LIFETIME_SECONDS });
      const refreshSessionData: CreateRefreshSessionData = {
        userId: user.id,
        jti: refreshTokenPayload.jti,
        sessionId: refreshTokenPayload.sessionId,
        issuedAt,
        expiresAt,
        isValid: true,
      };

      await refreshSessionRepository.createRefreshSession(refreshSessionData);

      return {
        status: ResultStatus.Success,
        data: { accessToken, refreshToken },
        errorsMessages: null,
      };
    },

    async refreshTokens(currentRefreshToken: string): Promise<Result<RefreshTokenSuccessViewModel>> {
      const refreshTokenPayload = await jwtService.verifyRefreshToken(currentRefreshToken);
      if (!refreshTokenPayload) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const issuedAt = new Date();
      const expiresAt = add(issuedAt, { seconds: REFRESH_SESSION_LIFETIME_SECONDS });
      const currentRefreshSession = await refreshSessionRepository.findRefreshSessionBySessionId(
        refreshTokenPayload.sessionId,
      );
      if (!currentRefreshSession) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.expiresAt < new Date()) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.userId !== refreshTokenPayload.userId) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.isValid !== true) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.jti !== refreshTokenPayload.jti) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const rotateRefreshSessionData: RotateRefreshSessionData = {
        jti: crypto.randomUUID(),
        issuedAt,
        expiresAt,
      };
      const isRefreshSessionRotated = await refreshSessionRepository.rotateRefreshSession(
        refreshTokenPayload.sessionId,
        refreshTokenPayload.jti,
        rotateRefreshSessionData,
      );
      if (!isRefreshSessionRotated) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const newAccessTokenPayload: JwtPayloadType = { userId: refreshTokenPayload.userId };
      const newRefreshTokenPayload: RefreshTokenPayloadType = {
        userId: refreshTokenPayload.userId,
        jti: rotateRefreshSessionData.jti,
        sessionId: refreshTokenPayload.sessionId,
        tokenType: "refresh",
      };
      const newAccessToken = await jwtService.createAccessToken(newAccessTokenPayload);
      const newRefreshToken = await jwtService.createRefreshToken(newRefreshTokenPayload);

      return {
        status: ResultStatus.Success,
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        errorsMessages: null,
      };
    },

    async logout(currentRefreshToken: string): Promise<Result<null>> {
      const refreshTokenPayload = await jwtService.verifyRefreshToken(currentRefreshToken);
      if (!refreshTokenPayload) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const currentRefreshSession = await refreshSessionRepository.findRefreshSessionBySessionId(
        refreshTokenPayload.sessionId,
      );
      if (!currentRefreshSession) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.expiresAt < new Date()) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.userId !== refreshTokenPayload.userId) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.isValid !== true) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      if (currentRefreshSession.jti !== refreshTokenPayload.jti) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const isRefreshSessionInvalidated =
        await refreshSessionRepository.invalidateRefreshSessionBySessionId(
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
    },

    async registration(dto: RegistrationInputDto): Promise<Result<null>> {
      const { login, password, email } = dto;
      const existingUserByLogin = await usersRepository.findUserByLogin(login);
      if (existingUserByLogin) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "login", message: "Login already exists" }],
        };
      }

      const existingUserByEmail = await usersRepository.findUserByEmail(email);
      if (existingUserByEmail) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "email", message: "Email already exists" }],
        };
      }

      const passwordHash = await passwordHashService.generateHash(password);
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
      await usersRepository.createUser(newUser);

      try {
        await emailService.sendEmail(
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
    },

    async confirmRegistration(dto: RegistrationConfirmationInputDto): Promise<Result<null>> {
      const { code } = dto;
      const user = await usersRepository.findUserByConfirmationCode(code);
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
          errorsMessages: [
            { field: "code", message: "Confirmation code has already been applied" },
          ],
        };
      }

      if (user.emailConfirmation.expirationDate < new Date()) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "code", message: "Confirmation code is expired" }],
        };
      }

      const isConfirmed = await usersRepository.confirmEmail(user.id);
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
    },
    async resendRegistrationEmail(dto: RegistrationEmailResendingInputDto): Promise<Result<null>> {
      const { email } = dto;
      const user = await usersRepository.findUserByEmail(email);
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

      const isUpdated = await usersRepository.updateEmailConfirmation(user.id, {
        confirmationCode,
        expirationDate,
      });

      if (isUpdated) {
        try {
          await emailService.sendEmail(email, confirmationCode, emailTemplates.registrationEmail);
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
    },
  };
};
