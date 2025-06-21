import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { GetUserDto } from './dto/get-user.dto';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { UserRoles } from 'src/enum/user.enum';
import { UserStatus } from 'src/enum/user-status.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password are not matching.',
      );
    }

    const isUserExist = await this.userModal
      .exists({ email: createUserDto.email })
      .lean();
    if (isUserExist) {
      throw new BadRequestException('User already exist.');
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userModal.create(createUserDto);

    return newUser;
  }

  async getUserById(getUserDto: GetUserDto) {
    const user = await this.userModal.findById(getUserDto.id).lean();
    if (!user) {
      throw new NotFoundException('User not exist.');
    }
    return user;
  }

  async getAllUsers(getAllUsersDto: GetAllUsersDto) {
    try {
      const { limit = 10, email, page = 1, role, status } = getAllUsersDto;
      const filter: {
        email?: { $regex: string; $options: string };
        role?: UserRoles;
        status?: UserStatus;
      } = {};
      if (email) filter.email = { $regex: email, $options: 'i' };
      if (role) filter.role = getAllUsersDto.role;
      if (status) filter.status = getAllUsersDto.status;

      const skip = (page - 1) * limit;

      const total = await this.userModal.countDocuments(filter);

      const users = await this.userModal
        .find(filter)
        .skip(skip)
        .limit(limit)
        .lean();

      const totalPage = Math.ceil(total / limit);

      return {
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPage,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return await this.userModal.findOne({ email }).select('+password').lean();
  }

  async getUserByIdWithRefreshToken(id: mongoose.Types.ObjectId) {
    return await this.userModal.findById(id).select('+refreshToken').lean();
  }

  async updateLoginTime(id: mongoose.Types.ObjectId, refreshToken: string) {
    await this.userModal.updateOne(
      { _id: id },
      {
        lastLogin: new Date(),
        refreshToken: refreshToken,
      },
    );
  }

  async updateRefreshToken(
    id: mongoose.Types.ObjectId,
    refreshToken: string | null,
  ) {
    await this.userModal.updateOne({ _id: id }, { refreshToken });
  }
}
