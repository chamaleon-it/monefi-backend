import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { InvestmentType } from 'src/enum/investment-type.enum';

export class BuyStockOrCrypto {
  @IsString({ message: 'Symbol must be a valid string.' })
  symbol: string;

  @IsString({ message: 'Name must be a valid string.' })
  name: string;

  @IsNumber({}, { message: 'Unit price must be a valid number.' })
  unitPrice: number;


  @IsNumber({}, { message: 'Quantity must be a valid number.' })
  quantity: number;

  @IsNumber({}, { message: 'Annual Coupon Rate must be a valid number.' })
  @IsOptional()
  annualCouponRate: number;

  @IsMongoId({ message: 'User must be a valid MongoDB ObjectId.' })
  @IsOptional() // This allows it to be missing if you handle it server-side
  user: mongoose.Types.ObjectId;

  @IsNumber({}, { message: 'Total value must be a valid number.' })
  @IsOptional() // Assuming you calculate this from quantity * unitPrice
  totalValue: number;

  // Use IsDateString to validate the format
  @IsOptional()
  @IsDateString({}, { message: 'Enter a valid buy back date string (e.g., YYYY-MM-DD).' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  buyBackDate?: string; // The date is received as a string

  @IsEnum(InvestmentType, {
    message: `Investment type must be one of the following: ${Object.values(InvestmentType).join(', ')}.`,
  })
  @IsOptional()
  investmentType: InvestmentType;
}
