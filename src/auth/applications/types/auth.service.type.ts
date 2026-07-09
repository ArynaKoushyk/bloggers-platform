import { Result } from "../../../core/result/result.type";
import { LoginInputDto } from "../../dto/login.input.dto";
import { LoginSuccessViewModel } from "../../types/login-success-view-model";
import { RegistrationInputDto } from "../../dto/registration.input.dto";
import { RegistrationConfirmationInputDto } from "../../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../../dto/registration-email-resending.input.dto";

export type AuthService = {
  login(dto: LoginInputDto): Promise<Result<LoginSuccessViewModel>>;
  registration(dto: RegistrationInputDto): Promise<Result<null>>;
  confirmRegistration(dto: RegistrationConfirmationInputDto): Promise<Result<null>>;
  resendRegistrationEmail(dto: RegistrationEmailResendingInputDto): Promise<Result<null>>;
};
