import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { SendMailClient } from 'zeptomail';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  async sendEmail(sendEmailDto: SendEmailDto) {
    const { token: zeptoToken, url: zeptoUrl } = configuration().zepto;
    const client = new SendMailClient({ url: zeptoUrl, token: zeptoToken });

    try {
      await client.sendMail({
        from: {
          address: 'hello@monefi.co.uk',
          name: 'Monefi.',
        },
        to: [
          {
            email_address: {
              address: sendEmailDto.email,
              name: sendEmailDto.name,
            },
          },
        ],
        subject: sendEmailDto.subject,
        htmlbody: sendEmailDto.htmlbody,
      });
      console.log(`Email successfully send to ${sendEmailDto.email}`);
    } catch (error) {
      console.log(error);
    }
  }
}
