import { AuthService } from "./types/auth.service.type";
import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { UsersRepository } from "../../users/applications/types/users.repository.type";
import { PasswordHashService } from "./types/password-hash.service.type";
import { ResultStatus } from "../../core/result/resultCode";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { JwtService } from "./types/jwt.service.type";
import { UserEntity } from "../../users/types/domain/user-entity.model";

export const createAuthService = (
  usersRepository: UsersRepository,
  passwordHashService: PasswordHashService,
  jwtService: JwtService,
): AuthService => {
  const checkUserCredentials = async (
    loginOrEmail: string,
    password: string,
  ): Promise<UserEntity | null> => {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await passwordHashService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
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
  };
};
