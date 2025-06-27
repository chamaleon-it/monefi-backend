import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Portfolio } from './schemas/portfolio.schema';
import { Model } from 'mongoose';
import { AddToPortfolioDto } from './dto/add-to-portfolio';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';

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

  async getPortfolio( user:JWTUserInterface){
        try {
            const portfolio = await this.portfolioModel.find({user:user.id}).sort("-createdAt").lean()
            return portfolio
        } catch (error) {
            throw error
        }
    }

}
