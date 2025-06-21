import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class GetUserDto {
  @IsMongoId({ message: 'Please provide a valid id' })
  id: mongoose.Types.ObjectId;
}
