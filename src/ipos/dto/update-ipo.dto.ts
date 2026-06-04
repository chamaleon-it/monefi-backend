import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { IpoStatus } from 'src/enum/ipo-status.enum';

export class UpdateIpoDto {
  @IsEnum(IpoStatus)
  @IsOptional()
  status?: IpoStatus;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
