import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRepository, Repository } from 'libs/modules';
import { Model } from 'mongoose';

import { Snapshot, SnapshotDocument } from './snapshot.schema';

export abstract class ISnapshotRepository extends IRepository<SnapshotDocument, Snapshot> {}

@Injectable()
export class SnapshotsRepository extends Repository<SnapshotDocument, Snapshot> implements ISnapshotRepository {
  constructor(@InjectModel(Snapshot.name) private readonly entity: Model<SnapshotDocument>) {
    super(entity);
  }
}
