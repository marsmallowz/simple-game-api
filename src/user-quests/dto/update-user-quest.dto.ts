import { PartialType } from '@nestjs/swagger';
import { CreateUserQuestDto } from './create-user-quest.dto';

export class UpdateUserQuestDto extends PartialType(CreateUserQuestDto) {}
