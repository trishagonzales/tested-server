export type SendTo = string | string[];

export type UrlType = 'forgot-password' | 'confirm-email';

export interface UrlDTO {
  url: string;
  urlType: UrlType;
}

export interface IMail {
  send: (subject: string, body: string) => void;
  sendForgotPasswordLink: (userID: string) => void;
  sendValidateEmailLink: (userID: string) => void;
}
