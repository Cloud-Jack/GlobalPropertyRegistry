import { Controller, Get } from '@nestjs/common';

import { BlockchainApiService } from './blockchain.service';

@Controller()
export class BlockchainApiController {
  constructor(private readonly blockchainApiService: BlockchainApiService) {}

  @Get()
  getHello(): string {
    return this.blockchainApiService.getHello();
  }
}
