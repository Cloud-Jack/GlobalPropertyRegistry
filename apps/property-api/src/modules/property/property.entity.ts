import { UserEntity } from 'apps/user-api/src/modules/user/entity/user.entity';
import { Polygon } from 'geojson';
import { Column, Index, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Unique(['country', 'city', 'localAddress', 'postcode'])
export class PropertyEntity {
  @PrimaryColumn({ length: 42, type: 'varchar' })
  contract: string;

  @Column({ length: 42, type: 'varchar' })
  @Index()
  factoryNode: string;

  @Column({ length: 42, type: 'varchar' })
  @Index()
  globalFactory: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: true,
  })
  @JoinColumn([{ name: 'ownerAddress', referencedColumnName: 'walletAddress' }])
  owner: UserEntity;
  ownerAddress?: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: true,
  })
  location: Polygon;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  postcode: string;

  @Column({ type: 'varchar' })
  localAddress: string;

  @Column({ type: 'varchar' })
  price: string;

  @Column({ length: 42, type: 'varchar' })
  @Index()
  currency: string;

  @Column({ type: 'boolean', default: false })
  isForSell: boolean;

  @Column({ type: 'integer' })
  createdAt: number;

  @Column({ type: 'integer' })
  updatedAt: number;
}
