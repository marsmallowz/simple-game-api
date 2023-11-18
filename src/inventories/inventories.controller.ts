import { Controller, Get, Param } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inventories')
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get()
  findAll() {
    return this.inventoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoriesService.findOne(id);
  }
}
