import { Module } from '@nestjs/common';

import { BlockchainApiController } from './blockchain.controller';
import { BlockchainApiService } from './blockchain.service';

@Module({
  imports: [],
  controllers: [BlockchainApiController],
  providers: [BlockchainApiService],
})
export class BlockchainApiModule {}
