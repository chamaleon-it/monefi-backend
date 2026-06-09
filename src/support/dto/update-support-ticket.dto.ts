import { IsEnum, IsNotEmpty } from 'class-validator';
import { SupportTicketStatus } from '../../enum/support.enum';

export class UpdateSupportTicketDto {
  @IsEnum(SupportTicketStatus)
  @IsNotEmpty()
  status: SupportTicketStatus;
}
