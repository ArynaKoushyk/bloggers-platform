import { PasswordHashService } from "../../auth/applications/types/password-hash.service.type";
import { UsersRepository } from "./types/users.repository.type";
import { UsersService } from "./types/users.service.type";
import { UserEntity } from "../types/domain/user-entity.model";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { CreateUserData } from "../types/data/create-user.data";

export const createUsersService = (
  usersRepository: UsersRepository,
  passwordHashService: PasswordHashService,
): UsersService => {
  return {
    async findUserById(id: string): Promise<Result<UserEntity>> {
      const user = await usersRepository.findUserById(id);
      if (!user) {
        return {
          status: ResultStatus.NotFound,
          data: null,
          errorsMessages: null,
        };
      }

      return {
        status: ResultStatus.Success,
        data: user,
        errorsMessages: null,
      };
    },
    async createUser(dto: CreateUserInputDto): Promise<Result<string>> {
      const { login, password, email } = dto;
      const existingLogin = await usersRepository.findUserByLogin(login);
      if (existingLogin) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "login", message: "login should be unique" }],
        };
      }
      const existingEmail = await usersRepository.findUserByEmail(email);
      if (existingEmail) {
        return {
          status: ResultStatus.BadRequest,
          data: null,
          errorsMessages: [{ field: "email", message: "email should be unique" }],
        };
      }
      const passwordHash = await passwordHashService.generateHash(password);
      const createData: CreateUserData = {
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
          confirmationCode: "",
          expirationDate: new Date(),
          isConfirmed: true,
        },
      };
      const userId = await usersRepository.createUser(createData);
      return {
        status: ResultStatus.Success,
        data: userId,
        errorsMessages: null,
      };
    },
    async deleteUser(id: string): Promise<Result<null>> {
      const isDeleted = await usersRepository.deleteUser(id);
      if (!isDeleted) {
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
    },
  };
};
