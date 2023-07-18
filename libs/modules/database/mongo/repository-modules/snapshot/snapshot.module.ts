import { Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConnectionName } from 'libs/modules/database/enum';
import { Connection, Model } from 'mongoose';

import { SnapshotsRepository } from './snapshot.repository';
import { Snapshot, SnapshotDocument, SnapshotSchema } from './snapshot.schema';

@Module({
  providers: [
    {
      provide: SnapshotsRepository,
      useFactory: (connection: Connection) =>
        new SnapshotsRepository(connection.model(Snapshot.name, SnapshotSchema) as Model<SnapshotDocument>),
      inject: [getConnectionToken(ConnectionName.MAIN)],
    },
  ],
  exports: [SnapshotsRepository],
})
export class SnapshotModule {}
