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

export const createAuthService = (
  usersRepository: UsersRepository,
  passwordHashService: PasswordHashService,
  jwtService: JwtService,
  emailService: EmailService,
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

      return {
        status: ResultStatus.Success,
        data: { accessToken },
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

      // return {
      //   status: ResultStatus.Success,
      //   data: null,
      //   errorsMessages: null,
      // };
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
