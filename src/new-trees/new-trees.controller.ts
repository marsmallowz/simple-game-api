import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewTreesService } from './new-trees.service';
import { CreateNewTreeDto } from './dto/create-new-tree.dto';
import { UpdateNewTreeDto } from './dto/update-new-tree.dto';

@Controller('new-trees')
export class NewTreesController {
  constructor(private readonly newTreesService: NewTreesService) {}

  @Post()
  create(@Body() createNewTreeDto: CreateNewTreeDto) {
    return this.newTreesService.create(createNewTreeDto);
  }

  @Get()
  findAll() {
    return this.newTreesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newTreesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewTreeDto: UpdateNewTreeDto) {
    return this.newTreesService.update(+id, updateNewTreeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newTreesService.remove(+id);
  }
}
