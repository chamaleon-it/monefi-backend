import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { InvestmentType } from 'src/enum/investment-type.enum';

export class GetAllTransactions {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @IsEnum(InvestmentType)
  @IsOptional()
  investmentType?: InvestmentType;
}
