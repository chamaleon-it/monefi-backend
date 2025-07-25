import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  name:string

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(8, { message: 'Minimum 8 character is requilred' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  password: string;

  @IsString()
  @MinLength(8, { message: 'Minimum 8 character is requilred' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  confirmPassword: string;
}
