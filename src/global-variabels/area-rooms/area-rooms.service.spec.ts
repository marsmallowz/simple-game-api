import { Test, TestingModule } from '@nestjs/testing';
import { AreaRoomsService } from './area-rooms.service';

describe('AreaRoomsService', () => {
  let service: AreaRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreaRoomsService],
    }).compile();

    service = module.get<AreaRoomsService>(AreaRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
