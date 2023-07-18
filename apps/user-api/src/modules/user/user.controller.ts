import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ResponseUserDto, UpdateUserRestrictedDTO } from './dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: ResponseUserDto })
  getMe(@Request() req): Promise<UserEntity> {
    return this.userService.getBy({ id: req.user.id }, req.user);
  }

  @Patch('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: ResponseUserDto })
  async updateMe(@Body() dto: UpdateUserRestrictedDTO, @Request() req): Promise<UserEntity> {
    return this.userService.updateByUser(req.user.id, dto);
  }
}
