import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['Individual', 'Business'])
  @IsOptional()
  accountType?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}
