import { IsString } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  name: string;
}
