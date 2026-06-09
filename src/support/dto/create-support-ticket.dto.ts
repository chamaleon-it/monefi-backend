import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SupportTicketSubject } from '../../enum/support.enum';

export class CreateSupportTicketDto {
  @IsEnum(SupportTicketSubject)
  @IsNotEmpty()
  subject: SupportTicketSubject;

  @IsString()
  @IsNotEmpty()
  message: string;
}
