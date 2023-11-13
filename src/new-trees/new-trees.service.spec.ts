import { Test, TestingModule } from '@nestjs/testing';
import { NewTreesService } from './new-trees.service';

describe('NewTreesService', () => {
  let service: NewTreesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewTreesService],
    }).compile();

    service = module.get<NewTreesService>(NewTreesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
