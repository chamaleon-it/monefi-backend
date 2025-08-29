import mongoose from 'mongoose';
import { IsMongoId, IsDateString } from 'class-validator';

// You can simplify the DTO to use IsDateString
export class UpdateTransactionDateDto {
  @IsMongoId({ message: 'Invalid transaction id format.' })
  id: mongoose.Types.ObjectId;

  // Use IsDateString to validate the format
  @IsDateString({},{ message: 'Enter a valid date string (e.g., YYYY-MM-DD).' },)
  date: string; // The date is received as a string
}
