import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from './bcrypt.service';

describe('BcryptService', () => {
  let service: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService],
    }).compile();

    service = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password and verify it successfully', async () => {
    const plainPassword = 'Pa$$w0rd2026!';
    const hash = await service.hashPassword(plainPassword);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(plainPassword);

    const isMatch = await service.comparePassword(plainPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await service.comparePassword('WrongPassword1!', hash);
    expect(isWrongMatch).toBe(false);
  });
});
