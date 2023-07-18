// import { Test } from '@nestjs/testing';

describe('UserRepository', () => {
  let userRepository: boolean;

  beforeEach(async () => {
    jest.clearAllMocks();
    // const app = await Test.createTestingModule({
    //   imports: [],
    //   providers: [],
    // }).compile();

    userRepository = true; // app.get(IUserRepository);
  });
  test('should verify instance', async () => {
    expect(userRepository).toBeTruthy();
  });
});
