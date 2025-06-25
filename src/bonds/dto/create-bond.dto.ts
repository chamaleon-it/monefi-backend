import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { CouponFrequency } from 'src/enum/coupon-frequency.enum';
import { CouponType } from 'src/enum/coupon-type.enum';

export class CreateBondDto {
  @IsString({ message: 'Bond name must be a string.' })
  @IsNotEmpty({ message: 'Bond name is required.' })
  name: string;

  @IsNumber({}, { message: 'Annual coupon rate must be a number.' })
  @IsNotEmpty({ message: 'Annual coupon rate is required.' })
  annualCouponRate: number;

  @IsString({ message: 'ISIN must be a string.' })
  @IsNotEmpty({ message: 'ISIN is required.' })
  isin: string;

  @IsEnum(CouponFrequency, {
    message: `Coupon frequency must be one of: ${Object.values(CouponFrequency).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Coupon frequency is required.' })
  couponFrequency: CouponFrequency;

  @IsNumber({}, { message: 'Unit price must be a number.' })
  @IsNotEmpty({ message: 'Unit price is required.' })
  unitPrice: number;

  @IsEnum(CouponType, {
    message: `Coupon type must be one of: ${Object.values(CouponType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Coupon type is required.' })
  couponType: CouponType;

  // @IsDateString({}, { message: 'Maturity date must be a valid ISO date string.' })
  @IsNotEmpty({ message: 'Maturity date is required.' })
  @Transform(({value}:{value:string})=>new Date(value))
  meturityDate: Date;

  @IsBoolean({ message: 'isPublic must be a boolean value (true or false).' })
  isPublic?: boolean = true;
}
