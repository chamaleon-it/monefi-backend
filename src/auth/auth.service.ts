import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { RefreshDto } from './dto/refresh.dto';
import configuration from 'src/config/configuration';
import { UserStatus } from 'src/enum/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ip: string, device: string) {
    try {
      const user = await this.usersService.getUserByEmail(loginDto.email);
      if (!user) throw new NotFoundException('User not found');
      if (user.status !== UserStatus.ACTIVE) {
        if (user.status === UserStatus.INACTIVE)
          throw new BadRequestException(
            'Your account is inactive,To active please contact our support team',
          );
        if (user.status === UserStatus.SUSPENDED)
          throw new BadRequestException(
            'Your account is suspended,To active please contact our support team',
          );
        if (user.status === UserStatus.DELETED)
          throw new BadRequestException(
            'Your account is deleted,To recover please contact our support team',
          );
      }
      const isPasswordMatching = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordMatching)
        throw new BadRequestException('Invalid credentials');

      // 2FA Verification
      if (user.twoFactorEnabled) {
        if (!loginDto.twoFactorCode) {
          return { requires2FA: true };
        }

        // Use otplib to verify the token
        const otplib = require('otplib');
        const isValid = otplib.authenticator.verify({
          token: loginDto.twoFactorCode,
          secret: user.twoFactorSecret,
        });

        if (!isValid) {
          throw new BadRequestException('Invalid 2FA code');
        }
      }

      const accessTokenPayload = {
        email: user.email,
        role: user.role,
        id: user._id,
      };
      const refreshTokenPayload = { id: user._id };
      const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
        expiresIn: '1h',
      });
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        { expiresIn: '7d', secret: configuration().secret.refreshToken },
      );
      await this.usersService.updateLoginTime(
        user._id,
        refreshToken,
        ip,
        device,
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(id: mongoose.Types.ObjectId) {
    try {
      await this.usersService.updateRefreshToken(id, null);
      return null;
    } catch (error) {
      throw error;
    }
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;

    if (!refreshToken) throw new ForbiddenException('Refresh token is missing');

    // Decode and verify refresh token
    const decoded = await this.verifyRefreshToken(refreshToken);
    if (!decoded?.id) throw new ForbiddenException('Invalid refresh token');

    const user = await this.usersService.getUserByIdWithRefreshToken(
      decoded.id,
    );
    if (!user || user.refreshToken !== refreshToken)
      throw new ForbiddenException('Refresh token mismatch');

    // Create new tokens
    const accessTokenPayload = {
      email: user.email,
      role: user.role,
      id: user._id,
    };
    const refreshTokenPayload = { id: user._id };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '1h',
    });

    const newRefreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      {
        expiresIn: '7d',
        secret: configuration().secret.refreshToken,
      },
    );

    // Save new refresh token in DB
    await this.usersService.updateRefreshToken(user._id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<{ id: mongoose.Types.ObjectId } | null> {
    try {
      const decoded: { id: mongoose.Types.ObjectId } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: configuration().secret.refreshToken,
        });
      return decoded;
    } catch {
      return null; // Simplify handling
    }
  }
}
