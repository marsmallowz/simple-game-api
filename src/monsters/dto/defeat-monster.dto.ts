import { IsNumber, IsObject } from 'class-validator';

export class DefeatMonsterDto {
  @IsNumber()
  defeat: number;

  @IsObject()
  monster: {
    _id: string;
  };
}
