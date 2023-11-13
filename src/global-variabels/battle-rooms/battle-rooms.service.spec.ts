import { Test, TestingModule } from '@nestjs/testing';
import { BattleRoomsService } from './battle-rooms.service';

describe('BattleRoomsService', () => {
  let service: BattleRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleRoomsService],
    }).compile();

    service = module.get<BattleRoomsService>(BattleRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
