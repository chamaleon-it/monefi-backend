import { IsEnum, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';
import { KycStatus } from 'src/enum/kyc-status.enum';

export class UpdateKycDto {
  @IsEnum(KycStatus, {
    message: `Status must be a valid KycStatus value: ${Object.values(KycStatus).join(', ')}`,
  })
  status: KycStatus;

  @IsMongoId({ message: 'User id must be a valid id.' })
  id: mongoose.Types.ObjectId;
}
