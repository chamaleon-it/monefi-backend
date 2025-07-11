import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService],
  imports:[EmailModule]
})
export class ContactUsModule {}
