import { IsNumber, IsObject } from 'class-validator';

export class QuantityRawMaterialDto {
  @IsNumber()
  quantity: number;

  @IsObject()
  rawMaterial: {
    _id: string;
  };
}
