import { IsNumber, IsOptional, Min } from 'class-validator';

export class CreateIpoRequestDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;
}
