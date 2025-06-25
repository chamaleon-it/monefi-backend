import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {

    @IsString()
      @MinLength(8, { message: 'Minimum 8 character is requilred' })
      @IsNotEmpty()
      @Transform(({ value }: { value: string }) => value.trim())
    currentPassword:string;

    @IsString()
      @MinLength(8, { message: 'Minimum 8 character is requilred' })
      @IsNotEmpty()
      @Transform(({ value }: { value: string }) => value.trim())
    password:string;

    @IsString()
      @MinLength(8, { message: 'Minimum 8 character is requilred' })
      @IsNotEmpty()
      @Transform(({ value }: { value: string }) => value.trim())
    confirmPassword:string;
}