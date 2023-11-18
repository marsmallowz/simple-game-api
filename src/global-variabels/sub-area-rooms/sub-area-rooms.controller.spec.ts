import { Test, TestingModule } from '@nestjs/testing';
import { SubAreaRoomsController } from './sub-area-rooms.controller';

describe('SubAreaRoomsController', () => {
  let controller: SubAreaRoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAreaRoomsController],
    }).compile();

    controller = module.get<SubAreaRoomsController>(SubAreaRoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
