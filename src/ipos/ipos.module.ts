import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsModule } from '../uploads/uploads.module';
import { IposController } from './ipos.controller';
import { IposService } from './ipos.service';
import { Ipo, IpoSchema } from './schemas/ipo.schema';
import { IpoRequest, IpoRequestSchema } from './schemas/ipo-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ipo.name, schema: IpoSchema },
      { name: IpoRequest.name, schema: IpoRequestSchema },
    ]),
    UploadsModule,
  ],
  controllers: [IposController],
  providers: [IposService],
})
export class IposModule {}
