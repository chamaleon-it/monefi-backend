import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateCertificateDto {
  @IsString({ message: 'File must be a string.' })
  @IsNotEmpty({ message: 'File is required.' })
  file: string;

  @IsMongoId({ message: 'ID must be a valid MongoDB ObjectId.' })
  id: mongoose.Types.ObjectId;
}
