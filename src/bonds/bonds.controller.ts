import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BondsService } from './bonds.service';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { CreateBondDto } from './dto/create-bond.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { GetAllBonds } from './dto/get-all-bonds.dto';

@Controller('bonds')
export class BondsController {
  constructor(private readonly bondsService: BondsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async createBond(@Body() createBondDto: CreateBondDto) {
    const data = await this.bondsService.createBond(createBondDto);
    return {
      data,
      message: 'Bond is created successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getBonds(
    @GetUser() user: JWTUserInterface,
    @Query() getAllBonds: GetAllBonds,
  ) {
    const { data, pagination } = await this.bondsService.getBonds(
      user,
      getAllBonds,
    );
    return {
      message: 'All bond where retrived',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':isin')
  async getBond(@Param('isin') isin: string) {
    const data = await this.bondsService.getBond(isin);
    return {
      message: 'Bond is retrived successfully.',
      data,
    };
  }
}
