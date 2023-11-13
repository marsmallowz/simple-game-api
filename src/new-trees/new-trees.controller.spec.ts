import { Test, TestingModule } from '@nestjs/testing';
import { NewTreesController } from './new-trees.controller';
import { NewTreesService } from './new-trees.service';

describe('NewTreesController', () => {
  let controller: NewTreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewTreesController],
      providers: [NewTreesService],
    }).compile();

    controller = module.get<NewTreesController>(NewTreesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
