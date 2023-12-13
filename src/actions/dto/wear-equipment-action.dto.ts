import { IsIn, IsOptional, IsString } from 'class-validator';

export class WearEquipmentActionDto {
  @IsString()
  equipmentId: string;

  @IsOptional()
  @IsIn(['Left', 'Right'])
  equipmentPosition: string;
}
