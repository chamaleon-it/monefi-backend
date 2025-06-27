import { Transform } from 'class-transformer';
import { IsEnum, isMongoId, IsMongoId, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { TransactionStatus } from 'src/enum/transaction-status.enum';

export class UpdateStatusDto {

  @IsMongoId()
  id: Types.ObjectId;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
