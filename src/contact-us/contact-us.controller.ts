import { Body, Controller, Post } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsDto } from './dto/contact-us.dto';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  async contactUs(@Body() contactUsDto:ContactUsDto){
    const data = await this.contactUsService.contactUs(contactUsDto)
    return {
      data,
      message:"Thank you."
    }
  }
}
