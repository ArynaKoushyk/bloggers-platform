export type EmailService = {
  sendEmail(email: string, code: string, template: (code: string) => string): Promise<void>;
};
