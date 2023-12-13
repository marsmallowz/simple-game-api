import { IsNumber, IsObject } from 'class-validator';

export class QuantityEquipmentDto {
  @IsNumber()
  quantity: number;

  @IsObject()
  equipment: {
    _id: string;
  };
}
