import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
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

import { Role } from '../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetAllUsersDTO, QueryUserGetByDTO, ResponseUserDto, UpdateUserDTO } from './dto';
import { UserEntity, UserRole } from './entity/user.entity';
import { UserService } from './user.service';

@ApiTags('Owner')
@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRole.OWNER)
export class OwnerController {
  constructor(private readonly userService: UserService) {}
  @Patch('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current owner profile' })
  @ApiOkResponse({ type: ResponseUserDto })
  async updateMe(@Body() dto: UpdateUserDTO, @Request() req): Promise<UserEntity> {
    return this.userService.updateByAdmin(req.user, req.user.id, dto);
  }

  @Post('users')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users list' })
  @ApiOkResponse({ type: ResponseUserDto })
  getAdminsList(@Body() body: GetAllUsersDTO, @Request() req) {
    return this.userService.getAll(req.user, body);
  }

  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get any user by' })
  @ApiOkResponse({ type: ResponseUserDto })
  async getUserBy(@Request() req, @Query() query: QueryUserGetByDTO): Promise<UserEntity> {
    const user = await this.userService.getBy(query, req.user);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system admin profile' })
  @ApiOkResponse({ type: ResponseUserDto })
  async updateUser(
    @Body() dto: UpdateUserDTO,
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<UserEntity> {
    return this.userService.updateByAdmin(req.user, id, dto);
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend system admin' })
  @HttpCode(HttpStatus.OK)
  async suspendUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.userService.suspend(req.user, id);
  }
}
