import { AuthSessionDbModel } from "../types/auth-session/auth-session-db.model";
import { SecurityDeviceViewModel } from "../types/auth-session/security-device-view-model";

export const mapToSecurityDeviceViewModel = (
  session: AuthSessionDbModel,
): SecurityDeviceViewModel => {
  return {
    ip: session.ip,
    title: session.deviceName,
    lastActiveDate: session.refreshToken.issuedAt.toISOString(),
    deviceId: session.deviceId,
  };
};
