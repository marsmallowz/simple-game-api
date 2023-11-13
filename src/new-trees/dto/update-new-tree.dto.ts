import { PartialType } from '@nestjs/mapped-types';
import { CreateNewTreeDto } from './create-new-tree.dto';

export class UpdateNewTreeDto extends PartialType(CreateNewTreeDto) {}
