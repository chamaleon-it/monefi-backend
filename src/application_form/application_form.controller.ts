import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApplicationFormService } from './application_form.service';
import { CreateApplicationDto } from './dto/create-application';
import { GetApplicationFormDto } from './dto/get-application-form-dto';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import mongoose from 'mongoose';

@Controller('application_form')
export class ApplicationFormController {
  constructor(
    private readonly applicationFormService: ApplicationFormService,
  ) {}

  @Post()
  async createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    const data =
      await this.applicationFormService.createApplication(createApplicationDto);
    return {
      message: 'Application created successfully',
      data,
    };
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRoles.ADMIN)
  @Get()
  async getAllApplicationForm(
    @Query() getApplicationFormDto: GetApplicationFormDto,
  ) {
    const { data, pagination } =
      await this.applicationFormService.getAllApplicationForm(
        getApplicationFormDto,
      );

    return {
      message: 'All Application retrived successfully',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: mongoose.Types.ObjectId) {
    if (!mongoose.isValidObjectId(id))
      throw new BadRequestException('id is not valid');
    const data = await this.applicationFormService.delete(id);
    return {
      message: 'Application is deleted',
      data,
    };
  }
}
