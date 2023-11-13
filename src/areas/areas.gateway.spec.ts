import { Test, TestingModule } from '@nestjs/testing';
import { AreasService } from './areas.service';
import { AreasGateway } from './areas.gateway';

describe('AreasGateway', () => {
  let gateway: AreasGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasGateway, AreasService],
    }).compile();

    gateway = module.get<AreasGateway>(AreasGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
