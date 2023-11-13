import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SubAreasService } from './sub-areas.service';
import { CreateSubAreaDto } from './dto/create-sub-area.dto';
import { Public } from 'src/auth/decorators/auth.decorator';

@Controller('sub-areas')
export class SubAreasController {
  constructor(private readonly subAreasService: SubAreasService) {}

  @Public()
  @Post()
  create(@Body() createSubAreaDto: CreateSubAreaDto) {
    return this.subAreasService.create(createSubAreaDto);
  }

  @Get()
  findAll() {
    return this.subAreasService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAreasService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubAreaDto: UpdateSubAreaDto) {
  //   return this.subAreasService.update(+id, updateSubAreaDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subAreasService.remove(+id);
  }
}