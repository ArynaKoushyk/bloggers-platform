import { Result } from "../../core/result/result.type";
import { LoginInputDto } from "../dto/login.input.dto";
import { LoginSuccessViewModel } from "../types/login-success-view-model";
import { RegistrationInputDto } from "../dto/registration.input.dto";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input.dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input.dto";
import { RefreshTokenSuccessViewModel } from "../types/auth-session/refresh-token-success-view-model";
import { RefreshTokenPayloadType } from "../types/auth-session/refresh-token-payload.type";
import { DeviceInfo } from "../types/device.info-type";
import { PasswordRecoveryInputDto } from "../dto/password-recovery.input.dto";
import { NewPasswordRecoveryInputDto } from "../dto/new-password-recovery.input.dto";

export interface IAuthService {
  login(dto: LoginInputDto, deviceInfo: DeviceInfo): Promise<Result<LoginSuccessViewModel>>;
  registration(dto: RegistrationInputDto): Promise<Result<null>>;
  confirmRegistration(dto: RegistrationConfirmationInputDto): Promise<Result<null>>;
  resendRegistrationEmail(dto: RegistrationEmailResendingInputDto): Promise<Result<null>>;
  refreshTokens(payload: RefreshTokenPayloadType): Promise<Result<RefreshTokenSuccessViewModel>>;
  logout(userId: string, deviceId: string): Promise<Result<null>>;
  invalidateAuthSession(userid: string, deviceId: string): Promise<Result<null>>;
  invalidateOtherAuthSessions(userid: string, currentDeviceId: string): Promise<Result<null>>;
  sendPasswordRecoveryEmail(dto: PasswordRecoveryInputDto): Promise<Result<null>>;
  resetPasswordWithRecoveryCode(dto: NewPasswordRecoveryInputDto): Promise<Result<null>>;
}
