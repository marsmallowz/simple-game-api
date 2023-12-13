import { PartialType } from '@nestjs/swagger';
import { CreateNpcDto } from './create-npc.dto';

export class UpdateNpcDto extends PartialType(CreateNpcDto) {}
