import mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateInterestStatusDto {
  @IsMongoId({ message: 'Invalid MongoDB ObjectId for portfolio id.' })
  @IsNotEmpty({ message: 'Portfolio id is required.' })
  id: mongoose.Types.ObjectId;

  @IsMongoId({ message: 'Invalid MongoDB ObjectId for interest id.' })
  @IsNotEmpty({ message: 'Interest id is required.' })
  interestId: mongoose.Types.ObjectId;

  @IsString()
  @IsNotEmpty({ message: 'status is required.' })
  status: string;
}
