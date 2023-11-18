import { PartialType } from '@nestjs/swagger';
import { CreateSubAreaDto } from './create-sub-area.dto';

export class FindSubAreaDto extends PartialType(CreateSubAreaDto) {}
