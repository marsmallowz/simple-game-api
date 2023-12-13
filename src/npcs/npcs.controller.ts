import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NpcsService } from './npcs.service';
import { CreateNpcDto } from './dto/create-npc.dto';
import { UpdateNpcDto } from './dto/update-npc.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/auth.decorator';

@Public()
@ApiTags('npcs')
@Controller('npcs')
export class NpcsController {
  constructor(private readonly npcsService: NpcsService) {}

  @Post()
  create(@Body() createNpcDto: CreateNpcDto) {
    return this.npcsService.create(createNpcDto);
  }

  @Get()
  findAll(@Query('subAreaId') subAreaId: string) {
    return this.npcsService.findAll({ subAreaId: subAreaId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.npcsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNpcDto: UpdateNpcDto) {
    return this.npcsService.update(+id, updateNpcDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.npcsService.remove(+id);
  }
}
