import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateSubAreaDto {
  @IsString()
  name: string;

  @IsNumber()
  coordinate: number;

  @IsArray()
  trees: { name: string; quantity: number }[];

  @IsArray()
  monsters: { name: string; level: number; hp: number; mp: number }[];

  @IsString()
  areaId: string;
}
