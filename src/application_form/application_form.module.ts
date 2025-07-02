import { Module } from '@nestjs/common';
import { ApplicationFormService } from './application_form.service';
import { ApplicationFormController } from './application_form.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './schemas/application.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }])],
  controllers: [ApplicationFormController],
  providers: [ApplicationFormService],
})
export class ApplicationFormModule {}
