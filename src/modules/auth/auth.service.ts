import { toUserResponseDto } from '@modules/users/mappers/user.mapper';
import { UsersService } from '@modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenService } from './service/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  private createAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }

  private createRefreshToken(payload: JwtPayload) {
    const secret = this.configService.get<string>('auth.jwtRefreshSecret');
    const expiresIn = this.configService.get<string>('auth.jwtRefreshExpiresIn') ?? '7d';

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  async login(dto: LoginDto, res: Response): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);

    await this.refreshTokenService.revokeAllForUser(user._id.toString());
    await this.refreshTokenService.create(user._id.toString(), refreshToken);

    this.setRefreshCookie(res, refreshToken);

    return { accessToken };
  }

  async refresh(req: Request, res: Response): Promise<AuthResponseDto> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh токен отсутствует');
    }

    const secret = this.configService.get<string>('auth.jwtRefreshSecret');

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('Невалидный или просроченный refresh токен');
    }

    const stored = await this.refreshTokenService.find(refreshToken);

    if (!stored || stored.revoked) {
      throw new UnauthorizedException('Refresh токен отозван или не найден');
    }

    await this.refreshTokenService.revoke(refreshToken);

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const newPayload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.createAccessToken(newPayload);
    const newRefreshToken = await this.createRefreshToken(newPayload);

    await this.refreshTokenService.create(user._id.toString(), newRefreshToken);

    this.setRefreshCookie(res, newRefreshToken);

    return { accessToken };
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.refreshTokenService.revoke(refreshToken);
    }

    res.clearCookie('refreshToken', { path: '/auth' });

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return toUserResponseDto(user);
  }
}
