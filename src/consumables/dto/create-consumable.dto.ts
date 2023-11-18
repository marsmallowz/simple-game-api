import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateConsumableDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  health: number;

  @IsOptional()
  @IsNumber()
  mana: number;
}
