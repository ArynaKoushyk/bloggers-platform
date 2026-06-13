import { Result } from "../../../core/result/result.type";
import { LoginInputDto } from "../../dto/login.input.dto";

export type AuthService = {
  login(dto: LoginInputDto): Promise<Result<null>>;
};
