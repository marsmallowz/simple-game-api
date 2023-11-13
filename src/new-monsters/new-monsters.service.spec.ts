import { Test, TestingModule } from '@nestjs/testing';
import { NewMonstersService } from './new-monsters.service';

describe('NewMonstersService', () => {
  let service: NewMonstersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewMonstersService],
    }).compile();

    service = module.get<NewMonstersService>(NewMonstersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
