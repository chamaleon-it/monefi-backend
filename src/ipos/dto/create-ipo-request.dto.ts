import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateIpoRequestDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
