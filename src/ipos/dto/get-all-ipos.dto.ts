import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetAllIpos {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
