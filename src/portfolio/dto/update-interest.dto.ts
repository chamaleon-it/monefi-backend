import mongoose from 'mongoose';
import { IsMongoId, IsDate, IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateInterestDto {
  @IsMongoId({ message: 'Invalid MongoDB ObjectId for id.' })
  @IsNotEmpty({ message: 'id is required.' })
  id: mongoose.Types.ObjectId;

  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
  @IsDate({ message: 'date must be a valid Date object.' })
  @IsNotEmpty({ message: 'date is required.' })
  date: Date;

  @IsNumber({}, { message: 'amount must be a number.' })
  @IsNotEmpty({ message: 'amount is required.' })
  amount: number;

  @IsString()
  @IsOptional()
  paymentType?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
