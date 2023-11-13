import { Test, TestingModule } from '@nestjs/testing';
import { NewMonstersController } from './new-monsters.controller';
import { NewMonstersService } from './new-monsters.service';

describe('NewMonstersController', () => {
  let controller: NewMonstersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewMonstersController],
      providers: [NewMonstersService],
    }).compile();

    controller = module.get<NewMonstersController>(NewMonstersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
