import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewMonstersService } from './new-monsters.service';
import { CreateNewMonsterDto } from './dto/create-new-monster.dto';
import { UpdateNewMonsterDto } from './dto/update-new-monster.dto';
import { Public } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('new-monsters')
@Controller('new-monsters')
export class NewMonstersController {
  constructor(private readonly newMonstersService: NewMonstersService) {}

  @Public()
  @Post()
  create(@Body() createNewMonsterDto: CreateNewMonsterDto) {
    return this.newMonstersService.create(createNewMonsterDto);
  }

  @Get()
  findAll() {
    return this.newMonstersService.findAll();
  }

  @Get(':id')
  findOne() {
    return;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewMonsterDto: UpdateNewMonsterDto,
  ) {
    return this.newMonstersService.update(+id, updateNewMonsterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newMonstersService.remove(+id);
  }
}
