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
import { MonstersService } from './monsters.service';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/auth.decorator';

@ApiTags('monsters')
@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Public()
  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto) {
    return this.monstersService.create(createMonsterDto);
  }

  @Get()
  findAll(@Query('subAreaId') subAreaId: string) {
    return this.monstersService.findAll({ subAreaId: subAreaId });
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monstersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonsterDto: UpdateMonsterDto) {
    return this.monstersService.update(id, updateMonsterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monstersService.remove(id);
  }
}
