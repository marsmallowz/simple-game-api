import { PartialType } from '@nestjs/mapped-types';
import { CreateNewMonsterDto } from './create-new-monster.dto';

export class UpdateNewMonsterDto extends PartialType(CreateNewMonsterDto) {}
