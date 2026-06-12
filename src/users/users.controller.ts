import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { JwtAuthGuard } from 'src/auth/guards/roles.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enum/user.enum';
import { RolesGuard } from 'src/auth/guards/ jwt-auth.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UserStatus } from 'src/enum/user-status.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import mongoose from 'mongoose';
import { CashDepositDto } from './dto/cash-deposit.dto';
import { KycDto } from './dto/kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.createUser(createUserDto);
    return {
      message: 'User created successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: JWTUserInterface) {
    const data = await this.usersService.getUserById({ id: user.id });
    return {
      message: 'User data retrived.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  async getAllUsers(@Query() getAllUsersDto: GetAllUsersDto) {
    const { data, pagination } =
      await this.usersService.getAllUsers(getAllUsersDto);
    return {
      message: 'All users data retrived.',
      data,
      pagination,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('/get_full_balance')
  async getFullBalance() {
    const data = await this.usersService.getFullBalance();
    return {
      message: 'Full balance retrived.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @Get('/kyc_status')
  async getKycStatus(@GetUser() user: JWTUserInterface) {
    const data = await this.usersService.getKycStatus(user.id);
    return {
      message: 'User Kyc status fetched successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get(':id')
  async getUser(@Param() getUserDto: GetUserDto) {
    const data = await this.usersService.getUserById(getUserDto);
    return {
      message: 'User data retrived.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(
    @Param() deleteUserDto: DeleteUserDto,
    @GetUser() user: JWTUserInterface,
  ) {
    if (deleteUserDto.id === user.id || user.role === UserRoles.ADMIN) {
      const data = await this.usersService.updateUserStatus({
        id: deleteUserDto.id,
        status: UserStatus.DELETED,
      });
      return {
        message: 'User is  deleted.',
        data,
      };
    }
    throw new UnauthorizedException();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change_password')
  async changePassword(
    @GetUser() user: JWTUserInterface,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.usersService.changePassword(
      user.id,
      changePasswordDto,
    );
    return {
      data,
      message: 'Password has changed successfully.',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const data = await this.usersService.forgotPassword(forgotPasswordDto);
    return {
      message: 'Password reset link has shared to to your email address.',
      data,
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const data = await this.usersService.resetPassword(resetPasswordDto);
    return {
      message: 'Password has reseted successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post(':id/deposit')
  async cashDeposit(
    @Param('id') id: mongoose.Types.ObjectId,
    @Body() cashDepositDto: CashDepositDto,
    @GetUser() user: JWTUserInterface,
  ) {
    const data = await this.usersService.cashDeposit(id, cashDepositDto, user);
    return {
      message: 'Cash deposited successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.USER)
  @Post('/kyc')
  async kyc(@GetUser() user: JWTUserInterface, @Body() kycDto: KycDto) {
    const data = await this.usersService.kyc(user, kycDto);
    return {
      message:
        'Your KYC update request is being processed. Please allow up to 24 hours.',
      data,
    };
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Post("/update_status")
    async updateKycStatus(@Body() updateKycDto:UpdateKycDto){
      const data = await this.usersService.updateKycStatus(updateKycDto)
      return {
        message:"User KYC status is updated.",
        data
      }
    }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(
    @GetUser() user: JWTUserInterface,
    @Body() updateProfileDto: any,
  ) {
    const data = await this.usersService.updateProfile(user.id, updateProfileDto);
    return {
      message: 'Profile updated successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/generate')
  async generateTwoFactorSecret(@GetUser() user: JWTUserInterface) {
    const data = await this.usersService.generateTwoFactorSecret(user);
    return {
      message: '2FA secret generated successfully.',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/turn-on')
  async turnOnTwoFactorAuth(
    @GetUser() user: JWTUserInterface,
    @Body('code') code: string,
  ) {
    await this.usersService.turnOnTwoFactorAuthentication(user, code);
    return {
      message: 'Two-factor authentication has been enabled.',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/2fa/turn-off')
  async turnOffTwoFactorAuth(
    @GetUser() user: JWTUserInterface,
    @Body('code') code: string,
  ) {
    await this.usersService.turnOffTwoFactorAuthentication(user, code);
    return {
      message: 'Two-factor authentication has been disabled.',
    };
  }
}
