import { Test, TestingModule } from '@nestjs/testing';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';

describe('TreesController', () => {
  let controller: TreesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreesController],
      providers: [TreesService],
    }).compile();

    controller = module.get<TreesController>(TreesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
