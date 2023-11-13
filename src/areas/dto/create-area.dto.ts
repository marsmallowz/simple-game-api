import { IsNumber, IsString } from 'class-validator';
import { SubArea } from 'src/sub-areas/schemas/sub-area.schema';

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsNumber()
  column: number;

  subAreas: SubArea[];
}
