import { Result } from "../../../core/result/result.type";
import { LoginInputDto } from "../../dto/login.input.dto";
import { LoginSuccessViewModel } from "../../types/login-success-view-model";

export type AuthService = {
  login(dto: LoginInputDto): Promise<Result<LoginSuccessViewModel>>;
};
