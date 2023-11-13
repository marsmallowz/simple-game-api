import { Test, TestingModule } from '@nestjs/testing';
import { SubAreaRoomsService } from './sub-area-rooms.service';

describe('SubAreaRoomsService', () => {
  let service: SubAreaRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubAreaRoomsService],
    }).compile();

    service = module.get<SubAreaRoomsService>(SubAreaRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
