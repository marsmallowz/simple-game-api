import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { SubAreasService } from './sub-areas.service';
import { CreateSubAreaDto } from './dto/create-sub-area.dto';
import { Public } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FindSubAreaDto } from './dto/find-sub-area.dto';
import { UpdateSubAreaDto } from './dto/update-sub-area.dto';

@ApiTags('sub-areas')
@Controller('sub-areas')
export class SubAreasController {
  constructor(private readonly subAreasService: SubAreasService) {}

  @Public()
  @Post()
  create(@Body() createSubAreaDto: CreateSubAreaDto) {
    return this.subAreasService.create(createSubAreaDto);
  }

  @Get()
  findAll(@Body() findSubAreaDto: FindSubAreaDto) {
    return this.subAreasService.findAll(findSubAreaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAreasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubAreaDto: UpdateSubAreaDto) {
    return this.subAreasService.update(id, updateSubAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subAreasService.remove(+id);
  }
}
