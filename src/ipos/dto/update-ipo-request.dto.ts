import { IsEnum, IsNotEmpty } from 'class-validator';
import { IpoRequestStatus } from 'src/enum/ipo-request-status.enum';

export class UpdateIpoRequestDto {
  @IsEnum(IpoRequestStatus)
  @IsNotEmpty()
  status: IpoRequestStatus;
}
