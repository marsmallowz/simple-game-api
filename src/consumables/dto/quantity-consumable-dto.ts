import { IsNumber, IsObject } from 'class-validator';

export class QuantityConsumableDto {
  @IsNumber()
  quantity: number;

  @IsObject()
  consumable: {
    _id: string;
  };
}
