import { PartialType } from '@nestjs/swagger';
import { CreateSubAreaDto } from './create-sub-area.dto';

export class UpdateSubAreaDto extends PartialType(CreateSubAreaDto) {}
