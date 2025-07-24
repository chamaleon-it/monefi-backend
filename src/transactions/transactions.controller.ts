import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { BuyStockOrCrypto } from './dto/buy-stock-or-crypto';
import { InvestmentType } from 'src/enum/investment-type.enum';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { GetAllTransactions } from './dto/get-all-transactions.dto';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { UpdateStatusDto } from './dto/update-status.dto';

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
        'Your  purchase request is pending. Please wait for confirmation.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post('/invest')
  async invest(@Body() buyStockOrCrypto: BuyStockOrCrypto) {
    buyStockOrCrypto.totalValue =
      buyStockOrCrypto.quantity * buyStockOrCrypto.unitPrice;
    const data =
      await this.transactionsService.buyStockOrCrypto(buyStockOrCrypto);
    return {
      message:
        'Your  purchase request is pending. Please wait for confirmation.',
      data,
    };
  }

  @Post('bond')
  buyBond(@GetUser() user: JWTUserInterface) {
    console.log(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransactions(
    @GetUser() user: JWTUserInterface,
    @Query() getAllTransactions: GetAllTransactions,
  ) {
    const { data, pagination } = await this.transactionsService.getTransactions(
      user,
      getAllTransactions,
    );
    return {
      data,
      pagination,
      message: 'All tranasction retrived',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('/status')
  async updateStatus(@Body() updateStatusDto: UpdateStatusDto) {
    const data = await this.transactionsService.updateStatus(updateStatusDto);
    return {
      message: 'Transaction status updated',
      data,
    };
  }
}
