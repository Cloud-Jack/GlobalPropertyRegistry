import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQuery {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  page = 1;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  limit = 50;
}

export class SortQuery<Entity> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  field: keyof Entity;

  @ApiProperty()
  @IsBoolean()
  desc: boolean;
}

export class GetAll<Entity> {
  @ApiPropertyOptional()
  @IsOptional()
  filter;

  @ApiPropertyOptional()
  @IsOptional()
  sort: SortQuery<Entity>;

  @ApiPropertyOptional()
  @IsOptional()
  pagination: PaginationQuery;
}
