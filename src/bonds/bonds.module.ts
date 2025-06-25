import { Module } from '@nestjs/common';
import { BondsService } from './bonds.service';
import { BondsController } from './bonds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bond, BondSchema } from './schemas/bond.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Bond.name, schema: BondSchema }])],
  controllers: [BondsController],
  providers: [BondsService],
})
export class BondsModule {}
