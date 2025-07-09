import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './schemas/portfolio.schema';
import { Model } from 'mongoose';
import { AddToPortfolioDto } from './dto/add-to-portfolio';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { InvestmentType } from 'src/enum/investment-type.enum';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name) private portfolioModel: Model<Portfolio>,
  ) {}

  async addToPortfolio(addToPortfolioDto: AddToPortfolioDto) {
    try {
      const portfolio = await this.portfolioModel.create(addToPortfolioDto);
      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  async getPortfolio(user: JWTUserInterface) {
    try {
      const portfolio = await this.portfolioModel
        .find({ user: user.id })
        .sort('-createdAt')
        .lean();
      return portfolio;
    } catch (error) {
      throw error;
    }
  }

  async statastics() {
    try {
      const result = await this.portfolioModel.aggregate([
        {
          $group: {
            _id: '$investmentType',
            total: { $sum: '$totalValue' },
          },
        },
      ]);

      // Transform aggregation result into final shape
      const data = {
        bondValue: 0,
        stockValue: 0,
        cryptoValue: 0,
      };

      for (const item of result) {
        if (item._id === InvestmentType.BOND) data.bondValue = item.total;
        else if (item._id === InvestmentType.STOCK)
          data.stockValue = item.total;
        else if (item._id === InvestmentType.CRYPTO)
          data.cryptoValue = item.total;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}
