export interface IEmailService {
  sendEmail(email: string, code: string, template: (code: string) => string): Promise<void>;
}
