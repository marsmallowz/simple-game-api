import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EquipmentType } from '../enums/equipment-type';
import { EquipmentRarity } from '../enums/equipment-rarity';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(EquipmentType)
  type: string;

  @IsEnum(EquipmentRarity)
  rarity: string;

  @IsNumber()
  attack: number;

  @IsNumber()
  defense: number;

  @IsNumber()
  magicAttack: number;

  @IsNumber()
  magicDefense: number;
}
