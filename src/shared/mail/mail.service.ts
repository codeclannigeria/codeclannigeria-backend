import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';
import Mail = require('nodemailer/lib/mailer');
import configuration from '~shared/config/configuration';

@Injectable()
export class MailService {
  private readonly config = configuration();
  private transporter: Mail;
  constructor() {
    this.createTransport();
  }

  private createTransport() {
    const { mailer } = this.config;
    this.transporter = nodemailer.createTransport(
      mg({
        auth: {
          api_key: mailer.key,
          domain: mailer.domain
        }
      })
    );
  }

  async sendMailAsync(mailOptions: Mail.Options): Promise<void> {
    const info = await this.transporter.sendMail(mailOptions);
    Logger.debug(`Message sent: ${info.messageId}`);

    // Preview only available when sending through an Ethereal account
    // Logger.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}
