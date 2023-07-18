import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ServiceName {
  USER = 'USER.API',
}

export enum EntityName {
  USER = 'USER',
  PROPERTY = 'PROPERTY',
}

export enum SnapshotAction {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  CREATE = 'CREATE',
}

@Schema()
export class Snapshot {
  @Prop({ type: String, enum: ServiceName, index: true, required: true, immutable: true })
  service: ServiceName;

  @Prop({ type: String, enum: SnapshotAction, index: true, required: true, immutable: true })
  action: SnapshotAction;

  @Prop({ type: String, enum: EntityName, required: true, immutable: true })
  entity: EntityName;

  @Prop({ type: Number, required: true, immutable: true })
  date: number;

  @Prop({ type: Object, required: true, immutable: true })
  initiator: unknown;

  @Prop({ type: Object, required: true, immutable: true })
  target: unknown;
}

export type SnapshotDocument = Snapshot & Document; // HydratedDocument<Snapshot>;

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
