import { IPasswordHashService } from "../../auth/interfaces/password-hash.service-interface";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { CreateUserInputDto } from "../dto/create-user.input.dto";
import { IUsersRepository } from "./interfaces/users.repository-interface";
import { IUsersService } from "./interfaces/users.service.interface";
import { inject, injectable } from "inversify";
import { PASSWORD_HASH_SERVICE, USERS_REPOSITORY } from "../../core/composition/di-tokens";
import { UserDocument, UserModel } from "../infrastructure/persistence/mongoose/user.model";

@injectable()
export class UsersService implements IUsersService {
  constructor(
    @inject(USERS_REPOSITORY) private usersRepository: IUsersRepository,
    @inject(PASSWORD_HASH_SERVICE) private passwordHashService: IPasswordHashService,
  ) {}
  async findUserById(id: string): Promise<Result<UserDocument>> {
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

    const data = {
      login,
      passwordHash,
      email,
    };

    const user = UserModel.createConfirmedUser(data);
    await this.usersRepository.save(user);
    return {
      status: ResultStatus.Success,
      data: user._id.toString(),
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
