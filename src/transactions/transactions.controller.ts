import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { BuyStockOrCrypto } from './dto/buy-stock-or-crypto';
import { InvestmentType } from 'src/enum/investment-type.enum';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/stock')
  async buyStock(
    @GetUser() user: JWTUserInterface,
    @Body() buyStockOrCrypto: BuyStockOrCrypto,
  ) {
    buyStockOrCrypto.user = user.id;
    buyStockOrCrypto.totalValue =
      buyStockOrCrypto.quantity * buyStockOrCrypto.unitPrice;
    buyStockOrCrypto.investmentType = InvestmentType.STOCK;
    const data =
      await this.transactionsService.buyStockOrCrypto(buyStockOrCrypto);
    return {
      message:
        'Your stock purchase request is pending. Please wait for confirmation.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/crypto')
  async buyCrypto(
    @GetUser() user: JWTUserInterface,
    @Body() buyStockOrCrypto: BuyStockOrCrypto,
  ) {
    buyStockOrCrypto.user = user.id;
    buyStockOrCrypto.totalValue =
      buyStockOrCrypto.quantity * buyStockOrCrypto.unitPrice;
    buyStockOrCrypto.investmentType = InvestmentType.CRYPTO;
    const data =
      await this.transactionsService.buyStockOrCrypto(buyStockOrCrypto);
    return {
      message:
        'Your crypto purchase request is pending. Please wait for confirmation.',
      data,
    };
  }

  @Post('bond')
  async buyBond(@GetUser() user: JWTUserInterface) {
    console.log(user);
  }
}
