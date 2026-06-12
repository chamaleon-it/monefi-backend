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
import { UpdateInterestDto } from './dto/update-interest.dto';
import { DeleteInterestDto } from './dto/delete-interest.dto';
import { UpdateInterestStatusDto } from './dto/update-interest-status.dto';

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

      portfolioQuary.populate('transaction', 'createdAt buyBackDate');
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

  async updateInterest(updateInterestDto: UpdateInterestDto): Promise<void> {
    const portfolio = await this.portfolioModel.findById(updateInterestDto.id);
    if (!portfolio) throw new NotFoundException('Portfolio not found.');
    portfolio.interest.push({
      date: updateInterestDto.date,
      amount: updateInterestDto.amount,
      paymentType: updateInterestDto.paymentType || 'Interest Payment',
      status: updateInterestDto.status || 'Upcoming',
    } as any);
    await portfolio.save();
  }

  async updateInterestStatus(
    updateInterestStatusDto: UpdateInterestStatusDto,
  ): Promise<void> {
    const portfolio = await this.portfolioModel.findById(
      updateInterestStatusDto.id,
    );
    if (!portfolio) throw new NotFoundException('Portfolio not found.');

    const interestEntry = portfolio.interest.find(
      (e: any) =>
        e._id.toString() === updateInterestStatusDto.interestId.toString(),
    );

    if (!interestEntry) {
      throw new NotFoundException('Interest entry not found.');
    }

    interestEntry.status = updateInterestStatusDto.status;
    await portfolio.save();
  }

  async deleteInterest(deleteInterestDto: DeleteInterestDto): Promise<void> {
    const portfolio = await this.portfolioModel.findById(deleteInterestDto.id);
    if (!portfolio) throw new NotFoundException('Portfolio not found.');
    portfolio.interest = portfolio.interest.filter(
      (e: any) => e._id.toString() !== deleteInterestDto.interestId.toString(),
    );
    await portfolio.save();
  }
}
