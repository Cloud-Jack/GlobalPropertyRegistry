import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CreateUserDTO, LoginUserDTO, UserUpdateTokensDTO } from '../user/dto/index';
import { UserTokensInterface, UserUpdateTokensInterface } from '../user/entity/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login-phrase/:walletAddress')
  @ApiOperation({ description: 'Get phrase for login' })
  async loginPhrase(@Param('walletAddress') walletAddress: string): Promise<string> {
    return this.authService.getLoginPhrase(walletAddress);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ description: 'Authorization user' })
  async login(@Body() payload: LoginUserDTO, @Request() req): Promise<UserTokensInterface> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  @ApiOperation({ description: 'Registration user' })
  async register(@Body() payload: CreateUserDTO): Promise<UserTokensInterface> {
    return this.authService.register(payload);
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ description: 'Refresh access token for the current user' })
  async updateTokens(@Body() payload: UserUpdateTokensDTO): Promise<UserUpdateTokensInterface> {
    return await this.authService.updateTokens(payload);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Logout the current user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
