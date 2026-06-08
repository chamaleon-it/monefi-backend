import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { IpoStatus } from 'src/enum/ipo-status.enum';

export class CreateIpoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  stockSymbol: string;

  @Transform(({ value }: { value: string }) => (value ? new Date(value) : null))
  @ValidateIf((o) => o.openDate === null || !isNaN(o.openDate?.getTime()))
  @IsDate()
  @IsNotEmpty()
  openDate: Date;

  @Transform(({ value }: { value: string }) => (value ? new Date(value) : null))
  @ValidateIf((o) => o.closeDate === null || !isNaN(o.closeDate?.getTime()))
  @IsDate()
  @IsNotEmpty()
  closeDate: Date;

  @Transform(({ value }: { value: string }) => (value ? new Date(value) : null))
  @ValidateIf((o) => o.listingDate === null || !isNaN(o.listingDate?.getTime()))
  @IsDate()
  @IsNotEmpty()
  listingDate: Date;

  @IsNumber()
  @IsNotEmpty()
  priceBandMin: number;

  @IsNumber()
  @IsNotEmpty()
  priceBandMax: number;

  @IsNumber()
  @IsNotEmpty()
  lotSize: number;

  @IsNumber()
  @IsNotEmpty()
  issueSize: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  companyDescription?: string;

  @IsString()
  @IsOptional()
  officialWebsite?: string;

  @IsEnum(IpoStatus)
  @IsOptional()
  status?: IpoStatus;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
