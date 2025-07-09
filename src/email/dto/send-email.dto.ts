import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsString()
  htmlbody: string;
}
