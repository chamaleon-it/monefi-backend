import { IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { TransactionStatus } from 'src/enum/transaction-status.enum';

export class UpdateStatusDto {
  @IsMongoId()
  id: Types.ObjectId;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
