import { IPasswordHashService } from "../../auth/interfaces/password-hash.service-interface";
import { UserEntity } from "../types/domain/user-entity.model";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { CreateUserData } from "../types/data/create-user.data";
import { IUsersRepository } from "./interfaces/users.repository-interface";
import { IUsersService } from "./interfaces/users.service.interface";

export class UsersService implements IUsersService {
  constructor(
    private usersRepository: IUsersRepository,
    private passwordHashService: IPasswordHashService,
  ) {}
  async findUserById(id: string): Promise<Result<UserEntity>> {
    const user = await this.usersRepository.findUserById(id);
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
  }
  async createUser(dto: CreateUserInputDto): Promise<Result<string>> {
    const { login, password, email } = dto;
    const existingLogin = await this.usersRepository.findUserByLogin(login);
    if (existingLogin) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "login", message: "login should be unique" }],
      };
    }
    const existingEmail = await this.usersRepository.findUserByEmail(email);
    if (existingEmail) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorsMessages: [{ field: "email", message: "email should be unique" }],
      };
    }
    const passwordHash = await this.passwordHashService.generateHash(password);
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
    const userId = await this.usersRepository.createUser(createData);
    return {
      status: ResultStatus.Success,
      data: userId,
      errorsMessages: null,
    };
  }
  async deleteUser(id: string): Promise<Result<null>> {
    const isDeleted = await this.usersRepository.deleteUser(id);
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
  }
}
