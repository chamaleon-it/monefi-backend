import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { BuyStockOrCrypto } from './dto/buy-stock-or-crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly usersService: UsersService,
  ) {}

  async buyStockOrCrypto(buyStockOrCrypto: BuyStockOrCrypto) {
    try {
      const user = await this.usersService.getUserById({
        id: buyStockOrCrypto.user,
      });
      if (buyStockOrCrypto.totalValue > user.balance)
        throw new BadRequestException(
          "Low balance! You don't have enough funds to buy this stock. Contact support to add more.",
        );
      await this.usersService.debitUserBalance(
        user._id,
        buyStockOrCrypto.totalValue,
      );

      const transaction = await this.transactionModel.create(buyStockOrCrypto);
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async buyBond() {}
}
