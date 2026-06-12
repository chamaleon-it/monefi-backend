import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import mongoose, { Model } from 'mongoose';
import { BuyStockOrCrypto } from './dto/buy-stock-or-crypto';
import { UsersService } from 'src/users/users.service';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { UserRoles } from 'src/enum/user.enum';
import { GetAllTransactions } from './dto/get-all-transactions.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TransactionStatus } from 'src/enum/transaction-status.enum';
import { PortfolioService } from 'src/portfolio/portfolio.service';
import { UpdateTransactionDateDto } from './dto/update-transaction-date.dto';
import { InvestmentType } from 'src/enum/investment-type.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly usersService: UsersService,
    private readonly portfolioService: PortfolioService,
  ) { }

  async buyStockOrCrypto(buyStockOrCrypto: BuyStockOrCrypto) {
    try {
      await this.usersService.getUserById({
        id: buyStockOrCrypto.user,
      });

      const transaction = await this.transactionModel.create(buyStockOrCrypto);
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async buyBond() { }

  async getTransactions(
    user: JWTUserInterface,
    getAllTransactions: GetAllTransactions,
  ) {
    try {
      const { limit = 10, page = 1 } = getAllTransactions;
      const filter: { user?: mongoose.Types.ObjectId; investmentType?: InvestmentType } = {};
      if (user.role === UserRoles.USER) {
        filter.user = user.id;
      }
      if (getAllTransactions.investmentType) {
        filter.investmentType = getAllTransactions.investmentType;
      }

      const skip = (page - 1) * limit;
      const total = await this.transactionModel.countDocuments(filter);
      const transactions = await this.transactionModel
        .find(filter)
        .populate('user', 'email name')
        .skip(skip)
        .limit(limit)
        .sort('createdAt')
        .lean();

      const totalPage = Math.ceil(total / limit);

      return {
        data: transactions,
        pagination: {
          total,
          page,
          limit,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(updateStatusDto: UpdateStatusDto) {
    try {
      const tranasction = await this.transactionModel.findById(
        updateStatusDto.id,
      );
      if (!tranasction) throw new NotFoundException('Transaction not found.');
      if (tranasction.status !== TransactionStatus.PENDING)
        throw new BadRequestException(
          'Transaction already updated the status.',
        );

      if (updateStatusDto.status === TransactionStatus.COMPLETED) {
        const user = await this.usersService.getUserById({
          id: tranasction.user,
        });
        if (tranasction.totalValue > user.balance)
          throw new BadRequestException(
            "Low balance! Don't have enough funds to buy this purchase.",
          );
        await this.usersService.debitUserBalance(
          user._id,
          tranasction.totalValue,
        );
        tranasction.status = TransactionStatus.COMPLETED;
        await tranasction.save();
        await this.portfolioService.addToPortfolio({
          symbol: tranasction.symbol,
          name: tranasction.name,
          user: user._id,
          unitPrice: tranasction.unitPrice,
          quantity: tranasction.quantity,
          totalValue: tranasction.totalValue,
          investmentType: tranasction.investmentType,
          transaction: tranasction._id,
        });
        return tranasction;
      } else if (updateStatusDto.status === TransactionStatus.CANCELLED) {
        tranasction.status = TransactionStatus.CANCELLED;
        await tranasction.save();
        return tranasction;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateDate(
    updateTransactionDateDto: UpdateTransactionDateDto,
  ): Promise<void> {
    const { id, date } = updateTransactionDateDto;

    const newDate = new Date(date);

    const result = await this.transactionModel.findByIdAndUpdate(
      id,
      {
        createdAt: newDate,
        updatedAt: newDate,
      },
      {
        new: true,
        timestamps: false,
        runValidators: true,
      },
    );

    if (!result) {
      throw new NotFoundException('Transaction not found.');
    }

  }
}
