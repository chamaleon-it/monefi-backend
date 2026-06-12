import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { ChangeBuyBackDto } from './dto/change-buyback.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { DeleteInterestDto } from './dto/delete-interest.dto';
import { UpdateInterestStatusDto } from './dto/update-interest-status.dto';

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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('/update_certificate')
  async updateCertificate(@Body() updateCertificateDto: UpdateCertificateDto) {
    const date =
      await this.portfolioService.updateCertificate(updateCertificateDto);
    return {
      message: 'Portfolio certificate is updated.',
      date,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('/update_interest')
  async updateInterest(@Body() updateInterestDto: UpdateInterestDto) {
    const data = await this.portfolioService.updateInterest(updateInterestDto);
    return {
      message: 'Interest is updated.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('/update_interest_status')
  async updateInterestStatus(
    @Body() updateInterestStatusDto: UpdateInterestStatusDto,
  ) {
    const data = await this.portfolioService.updateInterestStatus(
      updateInterestStatusDto,
    );
    return {
      message: 'Interest status is updated.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('delete_interest')
  async deleteInterest(@Body() deleteInterestDto: DeleteInterestDto) {
    const data = await this.portfolioService.deleteInterest(deleteInterestDto);
    return {
      message: 'Interest is deleted successfully',
      data,
    };
  }
}
