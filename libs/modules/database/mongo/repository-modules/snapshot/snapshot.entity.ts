import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsPositive } from 'class-validator';

import { EntityName, ServiceName, Snapshot, SnapshotAction } from './snapshot.schema';

export class SnapshotEntity implements Snapshot {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ServiceName)
  service: ServiceName;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SnapshotAction)
  action: SnapshotAction;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EntityName)
  entity: EntityName;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  date: number;

  @ApiProperty()
  @IsObject()
  initiator: Record<string, unknown>;

  @ApiProperty()
  @IsObject()
  target: Record<string, unknown>;
}
