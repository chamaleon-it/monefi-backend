import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IposService } from './ipos.service';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { CreateIpoDto } from './dto/create-ipo.dto';
import { UpdateIpoDto } from './dto/update-ipo.dto';
import { UpdateIpoRequestDto } from './dto/update-ipo-request.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { GetAllIpos } from './dto/get-all-ipos.dto';
import { GetAllIpoRequests } from './dto/get-all-ipo-requests.dto';

@Controller('ipos')
export class IposController {
  constructor(private readonly iposService: IposService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async createIpo(@Body() createIpoDto: CreateIpoDto) {
    const data = await this.iposService.createIpo(createIpoDto);
    return {
      data,
      message: 'IPO is created successfully.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getIpos(
    @GetUser() user: JWTUserInterface,
    @Query() getAllIpos: GetAllIpos,
  ) {
    const { data, pagination } = await this.iposService.getIpos(
      user,
      getAllIpos,
    );
    return {
      message: 'All IPOs were retrieved.',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('requests')
  async getAllRequests(@Query() getAllIpoRequests: GetAllIpoRequests) {
    const { data, pagination } = await this.iposService.getAllRequests(
      getAllIpoRequests,
    );
    return {
      message: 'All IPO requests were retrieved.',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @Get('my-requests')
  async getMyRequests(
    @GetUser() user: JWTUserInterface,
    @Query() getAllIpoRequests: GetAllIpoRequests,
  ) {
    const { data, pagination } = await this.iposService.getMyRequests(
      user,
      getAllIpoRequests,
    );
    return {
      message: 'My IPO requests were retrieved.',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get(':id/details')
  async getIpoDetails(@Param('id') id: string) {
    const data = await this.iposService.getIpoDetails(id);
    return {
      message: 'IPO details retrieved.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @Post(':id/request')
  async requestIpo(
    @GetUser() user: JWTUserInterface,
    @Param('id') id: string,
    @Body() createIpoRequestDto: import('./dto/create-ipo-request.dto').CreateIpoRequestDto,
  ) {
    const data = await this.iposService.requestIpo(user, id, createIpoRequestDto);
    return {
      message: 'IPO requested successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch(':id')
  async updateIpo(
    @Param('id') id: string,
    @Body() updateIpoDto: UpdateIpoDto,
  ) {
    const data = await this.iposService.updateIpo(id, updateIpoDto);
    return {
      message: 'IPO updated successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async deleteIpo(@Param('id') id: string) {
    const data = await this.iposService.deleteIpo(id);
    return {
      message: 'IPO deleted successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Patch('requests/:id')
  async updateRequestStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateIpoRequestDto,
  ) {
    const data = await this.iposService.updateRequestStatus(id, updateDto);
    return {
      message: 'IPO request status updated successfully.',
      data,
    };
  }
}
