import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsumablesService } from './consumables.service';
import { CreateConsumableDto } from './dto/create-consumable.dto';
import { UpdateConsumableDto } from './dto/update-consumable.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('consumables')
@Controller('consumables')
export class ConsumablesController {
  constructor(private readonly consumablesService: ConsumablesService) {}

  @Post()
  create(@Body() createConsumableDto: CreateConsumableDto) {
    return this.consumablesService.create(createConsumableDto);
  }

  @Get()
  findAll() {
    return this.consumablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumablesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsumableDto: UpdateConsumableDto,
  ) {
    return this.consumablesService.update(+id, updateConsumableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumablesService.remove(+id);
  }
}
