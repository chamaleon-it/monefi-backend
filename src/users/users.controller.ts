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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.createUser(createUserDto);
    return {
      message: 'User Created',
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
        message: 'user deleted',
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
      message: 'Password has changed successfully',
    };
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRoles.ADMIN)
  async getFullBalance(){
    const data = await this.usersService.getFullBalance()
    return {
      message:"Full balance retrived",
      data
    }
  }

}
