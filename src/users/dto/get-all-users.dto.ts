import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserStatus } from 'src/enum/user-status.enum';
import { UserRoles } from 'src/enum/user.enum';

export class GetAllUsersDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email?: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
}
