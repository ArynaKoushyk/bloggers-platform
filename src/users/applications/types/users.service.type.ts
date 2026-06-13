
import { Result } from "../../../core/result/result.type";
import { CreateUserInputDto } from "../../dto/create-user.input.dto";
import { UserEntity } from "../../types/domain/user-entity.model";

export type UsersService = {
  findUserById(id: string): Promise<Result<UserEntity>>;
  createUser(dto: CreateUserInputDto): Promise<Result<string>>;
  deleteUser(id: string): Promise<Result<null>>;
};
