import nodemailer from "nodemailer";
import { SETTINGS } from "../../core/settings/settings";
import { injectable } from "inversify";

@injectable()
export class NodemailerAdapter {
  async sendEmail(email: string, code: string, template: (code: string) => string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SETTINGS.GMAIL_USER,
        pass: SETTINGS.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Aryna" <${SETTINGS.GMAIL_USER}>`,
      to: email,
      subject: "Your code is here",
      text: "This email was sent using Nodemailer!",
      html: template(code),
    };

    await transporter.sendMail(mailOptions);
  }
}
