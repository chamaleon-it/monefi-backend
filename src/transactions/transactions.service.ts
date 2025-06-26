import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import mongoose, { Model } from 'mongoose';
import { BuyStockOrCrypto } from './dto/buy-stock-or-crypto';
import { UsersService } from 'src/users/users.service';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { UserRoles } from 'src/enum/user.enum';
import { GetAllTransactions } from './dto/get-all-transactions.dto';

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


  async getTransactions(user:JWTUserInterface,getAllTransactions:GetAllTransactions){
    try {
      const {limit = 10, page = 1} = getAllTransactions
      const filter:{user?:mongoose.Types.ObjectId} = {}
      if(user.role === UserRoles.USER){
        filter.user = user.id
      }

      const skip = (page - 1) * limit;
      const total = await this.transactionModel.countDocuments(filter);
      const bonds = await this.transactionModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort('-createdAt')
        .lean().populate("User");

        const totalPage = Math.ceil(total / limit);

      return {
        data: bonds,
        pagination: {
          total,
          page,
          limit,
          totalPage,
        },
      }



    } catch (error) {
      throw error
    }
    }

}
