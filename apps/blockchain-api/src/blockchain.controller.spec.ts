import { Test, TestingModule } from '@nestjs/testing';

import { BlockchainApiController } from './blockchain.controller';
import { BlockchainApiService } from './blockchain.service';

describe('BlockchainApiController', () => {
  let blockchainApiController: BlockchainApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainApiController],
      providers: [BlockchainApiService],
    }).compile();

    blockchainApiController = app.get<BlockchainApiController>(BlockchainApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(blockchainApiController.getHello()).toBe('Hello World!');
    });
  });
});
