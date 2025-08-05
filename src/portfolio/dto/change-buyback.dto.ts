import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { YesOrNoEnum } from 'src/enum/yes-or-no.enum';

export class ChangeBuyBackDto {
  @IsNotEmpty()
  @IsMongoId()
  id: mongoose.Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(YesOrNoEnum)
  buyBack: YesOrNoEnum;
}
