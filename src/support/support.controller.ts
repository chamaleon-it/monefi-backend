import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/roles.guard';
import { RolesGuard } from '../auth/guards/ jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../enum/user.enum';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';

@Controller('support')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) { }

  @Post()
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async create(@GetUser() user: JWTUserInterface, @Body() createDto: CreateSupportTicketDto) {
    return this.supportService.create(user.id, createDto);
  }

  @Get()
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async findAll(@Req() req) {
    // Admin sees all, User sees only their own
    if (req.user.role === UserRoles.ADMIN) {
      return this.supportService.findAll();
    }
    return this.supportService.findAll(req.user.userId);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN)
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateSupportTicketDto) {
    return this.supportService.updateStatus(id, updateDto);
  }
}
