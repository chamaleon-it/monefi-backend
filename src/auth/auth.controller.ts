import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/roles.guard';
import { GetUser } from './decorators/get-user.decorator';
import { JWTUserInterface } from 'src/interface/jwt-user.interface';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || 'Unknown IP';
    const device = req.headers['user-agent'] || 'Unknown Device';

    const data = await this.authService.login(loginDto, ip, device);
    return {
      message: 'Login successfull',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@GetUser() user: JWTUserInterface) {
    const data = await this.authService.logout(user.id);
    return {
      message: 'Logout successful',
      data,
    };
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    const data = await this.authService.refresh(refreshDto);
    return {
      message: 'Token is refreshed',
      data,
    };
  }
}
