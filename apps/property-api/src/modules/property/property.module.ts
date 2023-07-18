import { Module } from '@nestjs/common';

import { PropertyApiController } from './property.controller';
import { PropertyApiService } from './property.service';

@Module({
  imports: [],
  controllers: [PropertyApiController],
  providers: [PropertyApiService],
})
export class PropertyApiModule {}
