import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(dto, res);
    return res.json(result);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление access токена по refresh токену' })
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.refresh(req, res);
    return res.json(result);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение данных текущего пользователя' })
  async me(@Req() req) {
    return this.authService.me(req.user.sub);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.logout(req, res);
    return res.json(result);
  }
}
