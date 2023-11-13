import { IsNumber, IsString } from 'class-validator';

export class CreateSubAreaDto {
  @IsString()
  name: string;

  @IsNumber()
  coordinate: number;

  trees: { name: string; quantity: number }[];

  monsters: { name: string; level: number; hp: number; mp: number }[];

  @IsString()
  areaId: string;
}
