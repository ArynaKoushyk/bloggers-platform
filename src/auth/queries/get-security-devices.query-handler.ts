import { inject, injectable } from "inversify";
import { AUTH_SESSION_QUERY_REPOSITORY } from "../../core/composition/di-tokens";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IAuthSessionQueryRepository } from "../interfaces/auth-session.query-repository-interface";
import { mapToSecurityDeviceViewModel } from "../mappers/map-to-security-device-view-model.util";
import { SecurityDeviceViewModel } from "../types/auth-session/security-device-view-model";

@injectable()
export class GetSecurityDevicesQueryHandler {
  constructor(
    @inject(AUTH_SESSION_QUERY_REPOSITORY)
    private authSessionQueryRepository: IAuthSessionQueryRepository,
  ) {}

  async execute(userId: string): Promise<Result<SecurityDeviceViewModel[]>> {
    const sessions = await this.authSessionQueryRepository.findActiveAuthSessionsByUserId(userId);
    const devices = sessions.map(mapToSecurityDeviceViewModel);

    return {
      status: ResultStatus.Success,
      data: devices,
      errorsMessages: null,
    };
  }
}
