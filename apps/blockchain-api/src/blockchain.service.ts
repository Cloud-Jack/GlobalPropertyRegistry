import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
