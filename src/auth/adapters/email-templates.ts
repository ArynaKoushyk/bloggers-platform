import { SETTINGS } from "../../core/settings/settings";

export const emailTemplates = {
  registrationEmail(code: string) {
    return ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='${SETTINGS.FRONTEND_URL}/confirm-email?code=${code}'>complete registration</a>
              </p>`;
  },
  passwordRecoveryEmail(code: string) {
    return `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='${SETTINGS.FRONTEND_URL}/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`;
  },
};
