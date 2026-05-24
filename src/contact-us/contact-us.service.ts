import { Injectable } from '@nestjs/common';
import { ContactUsDto } from './dto/contact-us.dto';
import { EmailService } from 'src/email/email.service';
import { ContactFormDetailsEmail } from './template/ConatactUsTemplate';

@Injectable()
export class ContactUsService {
  constructor(private readonly emailService: EmailService) {}

  async contactUs(contactUsDto: ContactUsDto) {
    await this.emailService.sendEmail({
      name: `Baker Jones Holding Admin`,
      email: `hello@bakerjonesholdings.com`,
      subject: `New message form ${contactUsDto.firstName} ${contactUsDto.lastName}`,
      htmlbody: ContactFormDetailsEmail({
        name: `${contactUsDto.firstName} ${contactUsDto.lastName}`,
        email: contactUsDto.email,
        message: contactUsDto.message,
        phone: contactUsDto.phoneNumber,
      }),
    });
    //   await this.emailService.sendEmail({
    //   name: `Baker Jones Holding Developer`,
    //   email: '',
    //   subject: `New message form ${contactUsDto.firstName} ${contactUsDto.lastName}`,
    //   htmlbody: ContactFormDetailsEmail({
    //     name: `${contactUsDto.firstName} ${contactUsDto.lastName}`,
    //     email: contactUsDto.email,
    //     message: contactUsDto.message,
    //     phone: contactUsDto.phoneNumber,
    //   }),
    // });
    return null;
  }
}
