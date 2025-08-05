import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { ChangeBuyBackDto } from './dto/change-buyback.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPortfolio(@GetUser() user: JWTUserInterface) {
    const data = await this.portfolioService.getPortfolio(user);
    return {
      message: 'You portfolio is retrived successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('/statastics')
  async statastics() {
    const data = await this.portfolioService.statastics();
    return {
      message: 'Portfolio statastics retrived',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('/change_buyback')
  async changeBuyback(
    @GetUser() user: JWTUserInterface,
    @Body() changeBuyBackDto: ChangeBuyBackDto,
  ) {
    const data = await this.portfolioService.changeBuyback(
      user,
      changeBuyBackDto,
    );
    return {
      message: 'The buyback has been successfully updated.',
      data,
    };
  }
}
