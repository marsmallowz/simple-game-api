import { IsNumber, IsString } from 'class-validator';

export class CreateSubAreaDto {
  @IsString()
  name: string;

  @IsNumber()
  coordinate: number;

  @IsString()
  areaId: string;
}
