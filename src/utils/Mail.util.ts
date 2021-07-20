import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import sendgrid from 'nodemailer-sendgrid';
import { config } from './config.util';
import { IMail, SendTo, UrlDTO, UrlType } from '../types/Mail.types';

export class Mail implements IMail {
  private readonly to: SendTo;

  constructor(to: SendTo) {
    this.to = to;
  }

  async send(subject: string, body: string) {
    const transport = nodemailer.createTransport(
      sendgrid({ apiKey: config.SENDGRID_API_KEY as string })
    );

    await transport.sendMail({
      from: 'trishagonzales.dev@gmail.com',
      to: this.to,
      subject,
      html: body,
    });
  }

  async sendForgotPasswordLink(userID: string) {
    const urlDTO = this.genConfirmationUrl(userID, 'forgot-password');
    const body = this.genConfirmationHtmlPage(
      urlDTO,
      'Click the button below to reset your password'
    );
    await this.send('Reset', body);
  }

  async sendValidateEmailLink(userID: string) {
    const urlDTO = this.genConfirmationUrl(userID, 'confirm-email');
    const body = this.genConfirmationHtmlPage(
      urlDTO,
      'Click the button below to confirm your email'
    );
    await this.send('Confirm', body);
  }

  private genConfirmationUrl(userID: string, urlType: UrlType): UrlDTO {
    let url = '';
    let token: string;
    token = jwt.sign({ userID }, config.JWT_KEY!, {
      expiresIn: urlType === 'forgot-password' ? '1d' : '100d',
    });
    if (urlType === 'confirm-email') url = `${config.FRONTEND_URL}/email/confirm/${token}`;
    if (urlType === 'forgot-password') url = `${config.FRONTEND_URL}/password/reset/${token}`;

    return { url, urlType };
  }

  private genConfirmationHtmlPage(urlDTO: UrlDTO, description: string): string {
    return `
      <html>
      <head>
      <style>
      .container {
        max-width: 600px;
        margin: auto;
        padding: 2.5em 1em;
              font-family: sans-serif;
              font-size: 16px;
            }
            .description {
              margin: 2em 0;
            }
            .confirm-button {
              padding: 0.7em 1em;
              background: dodgerblue;
              border-radius: 5px;
              box-shadow: 1px 2px 10px #ddd;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              color: white;
              text-decoration: none;
              cursor: pointer;
            }
            .url {
              font-size: 14px;
            }
          </style>
          </head>
          <body>
          <div class="container">
            <p class="description">${description}</p>
            <a class="confirm-button" href="${urlDTO.url}">${
      urlDTO.urlType === 'forgot-password' ? 'RESET' : 'CONFIRM'
    }
            </a>
            <p class="description">If button above didn't work, copy the url below and paste in browser.</p>
            <p class="url">${urlDTO.url}</p>
            </div>
        </body>
        </html>
        `;
  }
}
