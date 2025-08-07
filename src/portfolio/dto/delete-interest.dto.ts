import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class DeleteInterestDto {
  @IsMongoId({ message: 'Invalid MongoDB ObjectId for id.' })
  @IsNotEmpty({ message: 'id is required.' })
  id: mongoose.Types.ObjectId;

  @IsMongoId({ message: 'Invalid MongoDB ObjectId for interestId.' })
  @IsNotEmpty({ message: 'interestId is required.' })
  interestId: mongoose.Types.ObjectId;
}
