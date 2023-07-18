import { Test, TestingModule } from '@nestjs/testing';

import { PropertyApiController } from './property.controller';
import { PropertyApiService } from './property.service';

describe('PropertyApiController', () => {
  let propertyApiController: PropertyApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PropertyApiController],
      providers: [PropertyApiService],
    }).compile();

    propertyApiController = app.get<PropertyApiController>(PropertyApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(propertyApiController.getHello()).toBe('Hello World!');
    });
  });
});
