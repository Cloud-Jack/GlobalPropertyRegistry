import { Test } from '@nestjs/testing';

import { SecretsModule } from '../module';
import { SecretsService } from '../service';

describe('SecretsService', () => {
  let commonSecrets: SecretsService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [SecretsModule],
    }).compile();

    commonSecrets = app.get(SecretsService);
  });

  describe('common', () => {
    test('should get common secrets successfully', () => {
      expect(commonSecrets.ENV).toEqual('test');
    });
  });

  describe('propertyAPI', () => {
    test('should get propertyAPI secrets successfully', () => {
      expect(commonSecrets.propertyAPI.port).toEqual('3000');
    });
  });

  describe('authAPI', () => {
    test('should get authAPI secrets successfully', () => {
      expect(commonSecrets.authAPI.port).toEqual('4000');
    });
  });
});
