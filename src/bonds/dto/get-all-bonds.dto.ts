import { IsNumber, IsOptional } from 'class-validator';

export class GetAllBonds {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
