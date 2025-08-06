import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './schemas/portfolio.schema';
import { Model } from 'mongoose';
import { AddToPortfolioDto } from './dto/add-to-portfolio';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { InvestmentType } from 'src/enum/investment-type.enum';
import { ChangeBuyBackDto } from './dto/change-buyback.dto';
import { UserRoles } from 'src/enum/user.enum';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

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
      const portfolioQuary = this.portfolioModel
        .find()
        .sort('-createdAt')
        .lean();
      if (user.role === UserRoles.USER) {
        portfolioQuary.where({ user: user.id });
      } else {
        portfolioQuary.populate('user', 'name email');
      }

      const portfolio = await portfolioQuary;

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

  async changeBuyback(
    user: JWTUserInterface,
    changeBuyBackDto: ChangeBuyBackDto,
  ): Promise<void> {
    const portfolio = await this.portfolioModel.findById(changeBuyBackDto.id);
    if (!portfolio)
      throw new NotFoundException('This portfolio does not exist.');
    if (portfolio.buyBack === changeBuyBackDto.buyBack)
      throw new BadRequestException(
        'The buyback for this portfolio has already been updated.',
      );
    portfolio.buyBack = changeBuyBackDto.buyBack;
    await portfolio.save();
  }

  async updateCertificate(
    updateCertificateDto: UpdateCertificateDto,
  ): Promise<void> {
    const portfolio = await this.portfolioModel.findById(
      updateCertificateDto.id,
    );
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    portfolio.certificate = updateCertificateDto.file;
    await portfolio.save();
  }
}
