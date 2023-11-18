import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTreeDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalQuantity: number;

  @IsString()
  subAreaId: string;

  @IsOptional()
  @IsArray()
  rawMaterialDrops: { rawMaterial: { id: string }; rate: number }[];

  @IsOptional()
  @IsArray()
  consumableDrops: { consumable: { id: string }; rate: number }[];
}
