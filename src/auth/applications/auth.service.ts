import { AuthService } from "./types/auth.service.type";
import { LoginInputDto } from "../dto/login.input.dto";
import { Result } from "../../core/result/result.type";
import { UsersRepository } from "../../users/applications/types/users.repository.type";
import { PasswordHashService } from "./types/password-hash.service.type";
import { ResultStatus } from "../../core/result/resultCode";
export const createAuthService = (
  usersRepository: UsersRepository,
  passwordHashService: PasswordHashService,
): AuthService => {
  return {
    async login(dto: LoginInputDto): Promise<Result<null>> {
      const { loginOrEmail, password } = dto;
      const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
      if (!user) {
        return {
          status: ResultStatus.Unauthorized,
          data: null,
          errorsMessages: null,
        };
      }
      const isPasswordCorrect = await passwordHashService.compare(
        password,
        user.passwordHash,
      );

      if (!isPasswordCorrect) {
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
  };
};
