import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { QuestType } from '../enums/quest-type.enum';
import { Type } from 'class-transformer';
import { QuantityConsumableDto } from 'src/consumables/dto/quantity-consumable-dto';
import { QuantityRawMaterialDto } from 'src/raw-materials/dto/quantity-raw-material.dto';
import { QuantityEquipmentDto } from './../../equipment/dto/quantity-equipment.dto';
import { DefeatMonsterDto } from 'src/monsters/dto/defeat-monster.dto';

export class CreateQuestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(QuestType)
  type: string;

  @ValidateNested({ each: true })
  @Type(() => QuantityRawMaterialDto)
  rawMaterialsNeeded: QuantityRawMaterialDto[];

  @ValidateNested({ each: true })
  @Type(() => QuantityConsumableDto)
  consumablesNeeded: QuantityConsumableDto[];

  @ValidateNested({ each: true })
  @Type(() => QuantityRawMaterialDto)
  rawMaterialsObtained: QuantityRawMaterialDto[];

  @ValidateNested({ each: true })
  @Type(() => QuantityConsumableDto)
  consumablesObtained: QuantityConsumableDto[];

  @ValidateNested({ each: true })
  @Type(() => QuantityEquipmentDto)
  equipmentObtained: QuantityEquipmentDto[];

  @ValidateNested()
  @Type(() => DefeatMonsterDto)
  defeatMonsters: DefeatMonsterDto[];

  @IsString()
  npcId: string;
}
