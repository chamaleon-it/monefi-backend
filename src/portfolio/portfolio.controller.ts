import { Controller, Get, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoles.USER)
  @Get()
  async getPortfolio(@GetUser() user:JWTUserInterface){
  const data  = await this.portfolioService.getPortfolio(user)  
  return {
    message:"You portfolio is retrived successfully",
    data
  }
  }

}
