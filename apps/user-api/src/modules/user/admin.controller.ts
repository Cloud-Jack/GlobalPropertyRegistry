import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'libs/utils';

import { Role } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetAllUsersDTO, QueryUserGetByDTO, ResponseUserDto, UpdateUserDTO } from './dto';
import { UserEntity, UserRole } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system users list' })
  // @ApiOkResponse({ type: ResponseUserDto })
  getUsersList(@Body() body: GetAllUsersDTO, @Request() req) {
    return this.userService.getAll(req.user, body);
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system user by' })
  @ApiOkResponse({ type: ResponseUserDto })
  async getUserBy(@Request() req, @Query() query: QueryUserGetByDTO): Promise<UserEntity> {
    const user = await this.userService.getBy(query, req.user);
    if (!user) {
      throw new ApiException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch('user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system user profile' })
  @ApiOkResponse({ type: ResponseUserDto })
  async updateUser(
    @Body() dto: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<UserEntity> {
    return this.userService.updateByAdmin(req.user, id, dto);
  }

  @Delete('user/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend system user' })
  @HttpCode(HttpStatus.OK)
  async suspendUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.userService.suspend(req.user, id);
  }
}
