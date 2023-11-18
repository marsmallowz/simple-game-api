import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMonsterDto {
  @IsString()
  name: string;

  @IsNumber()
  totalHp: number;

  @IsNumber()
  totalMp: number;

  @IsNumber()
  currentHp: number;

  @IsNumber()
  currentMp: number;

  @IsNumber()
  level: number;

  @IsNumber()
  attack: number;

  @IsNumber()
  defense: number;

  @IsNumber()
  experience: number;

  @IsString()
  subAreaId: string;

  @IsOptional()
  @IsArray()
  rawMaterialDrops: { rawMaterial: { id: string }; rate: number }[];
}
