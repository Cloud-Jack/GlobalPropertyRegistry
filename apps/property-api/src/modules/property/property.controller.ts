import { Controller, Get } from '@nestjs/common';

import { PropertyApiService } from './property.service';

@Controller()
export class PropertyApiController {
  constructor(private readonly propertyApiService: PropertyApiService) {}

  @Get()
  getHello(): string {
    return this.propertyApiService.getHello();
  }
}
