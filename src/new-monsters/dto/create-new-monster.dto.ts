import { IsNumber } from 'class-validator';

export class CreateNewMonsterDto {
  @IsNumber()
  totalHp: number;

  @IsNumber()
  totalMp: number;

  @IsNumber()
  currentHp: number;

  @IsNumber()
  currentMp: number;

  @IsNumber()
  currentLevel: number;

  @IsNumber()
  attack: number;

  @IsNumber()
  defense: number;

  rawMaterialDrops: any[];
}
