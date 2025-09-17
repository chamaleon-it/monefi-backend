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
// import { DeleteUserDto } from './dto/delete-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordEmail } from './template/ResetPasswordEmail';
import { CashDepositDto } from './dto/cash-deposit.dto';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { KycDto } from './dto/kyc.dto';
// import { JWTUserInterface } from 'src/interface/jwt-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModal: Model<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

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
        .sort('-createdAt')
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

  async updateUserStatus({
    id,
    status,
  }: {
    id: mongoose.Types.ObjectId;
    status: UserStatus;
  }) {
    try {
      const user = await this.userModal.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.status = status;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    id: mongoose.Types.ObjectId,
    changePasswordDto: ChangePasswordDto,
  ) {
    try {
      if (changePasswordDto.password !== changePasswordDto.confirmPassword)
        throw new BadRequestException(
          'Password and confirm password are not matching.',
        );

      if (changePasswordDto.password === changePasswordDto.currentPassword)
        throw new BadRequestException(
          'Current password and new pasword are same.',
        );

      const user = await this.userModal.findById(id).select('+password');
      if (!user) throw new NotFoundException('User not found');
      const isPasswordMatching = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );
      if (!isPasswordMatching)
        throw new BadRequestException('Invalid credentials');

      user.password = await bcrypt.hash(changePasswordDto.password, 10);
      await user.save();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async getFullBalance(): Promise<number> {
    try {
      const result = await this.userModal.aggregate([
        {
          $group: {
            _id: null,
            totalBalance: { $sum: '$balance' },
          },
        },
      ]);

      return (result[0]?.totalBalance as number) || 0;
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

  async debitUserBalance(id: mongoose.Types.ObjectId, balance: number) {
    try {
      const user = await this.userModal.findById(id);
      if (!user) {
        throw new BadRequestException('User not exist.');
      }
      user.balance = user.balance - balance;

      await user.save();
    } catch (error) {
      throw error;
    }
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.userModal
        .findOne({ email: forgotPasswordDto.email })
        .lean();

      if (!user) {
        throw new BadRequestException(
          'This email address is not exist in our database, Please check your email address.',
        );
      }
      const token = await this.jwtService.signAsync(
        { id: user._id },
        {
          expiresIn: '2h',
          secret: configuration().secret.forgotPassword,
        },
      );
      const passwordResetLink = `${configuration().domain}/reset-password?token=${token}`;
      await this.emailService.sendEmail({
        email: user.email,
        name: user.email,
        subject: 'Password reset link from Monefi.',
        htmlbody: ResetPasswordEmail(passwordResetLink),
      });
      return null;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      if (resetPasswordDto.password !== resetPasswordDto.confirmPassword)
        throw new BadRequestException(
          'Password and confirm password are not matching.',
        );

      if (!resetPasswordDto.token) {
        throw new BadRequestException('Token is required.');
      }

      let decode: { id: string };
      try {
        decode = await this.jwtService.verifyAsync(resetPasswordDto.token, {
          secret: configuration().secret.forgotPassword,
        });
      } catch (err) {
        console.log(err);
        throw new BadRequestException(
          'Invalid or expired password reset token. Please initiate the ‘Forgot Password’ process again.',
        );
      }

      if (!decode || !decode.id) {
        throw new BadRequestException(
          'The password reset link is no longer valid. Please initiate the ‘Forgot Password’ process again. The link is only valid for 2 hours.',
        );
      }

      const user = await this.userModal.findById(decode.id);
      if (!user) throw new BadRequestException('User not exist.');
      user.password = await bcrypt.hash(resetPasswordDto.password, 10);
      await user.save();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async cashDeposit(
    id: mongoose.Types.ObjectId,
    cashDepositDto: CashDepositDto,
    depositeder: JWTUserInterface,
  ) {
    try {
      const user = await this.userModal.findById(id);
      if (!user) {
        throw new BadRequestException('User not found.');
      }
      user.balance = user.balance + cashDepositDto.amount;
      user.depositHistory.push({
        amount: cashDepositDto.amount,
        date: new Date(),
        depositedBy: depositeder.id,
      });
      await user.save();
      return null;
    } catch (error) {
      throw error;
    }
  }

  async kyc(user: JWTUserInterface, kycDto: KycDto) {
    const found = await this.userModal.findById(user.id);
    if (!found) {
      throw new BadRequestException('user not found');
    }
    found.proofOfAddress = kycDto.proofOfAddress;
    found.identityVerification = kycDto.identityVerification;
    await found.save();
    return found;
  }
}
