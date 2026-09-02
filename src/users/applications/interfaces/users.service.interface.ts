import { Result } from "../../../core/result/result.type";
import { CreateUserInputDto } from "../../dto/create-user.input.dto";
import { UserDocument } from "../../infrastructure/persistence/mongoose/user.model";

export interface IUsersService {
  findUserById(id: string): Promise<Result<UserDocument>>;
  createUser(dto: CreateUserInputDto): Promise<Result<string>>;
  deleteUser(id: string): Promise<Result<null>>;
}
