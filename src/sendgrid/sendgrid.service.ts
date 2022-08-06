import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send(
    mail: SendGrid.MailDataRequired,
  ): Promise<{ error: { code: string; detail: string }; statusCode: number }> {
    try {
      const transport = await SendGrid.send(mail);
      return { error: null, statusCode: transport[0].statusCode };
    } catch ({ response, code }) {
      return {
        error: {
          code: 'sengrid_error',
          detail: response.body.errors,
        },
        statusCode: code,
      };
    }
  }
}
