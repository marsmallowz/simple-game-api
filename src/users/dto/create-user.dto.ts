import { IsEmail, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNumber()
  hp: number;

  @IsNumber()
  mp: number;

  @IsNumber()
  currentHp: number;

  @IsNumber()
  currentMp: number;

  @IsNumber()
  attack: number;

  @IsNumber()
  magicAttack: number;

  @IsNumber()
  defense: number;

  @IsNumber()
  magicDefense: number;

  @IsNumber()
  str: number;

  @IsNumber()
  int: number;

  @IsNumber()
  vit: number;

  @IsNumber()
  dex: number;

  @IsNumber()
  luck: number;

  @IsNumber()
  pointLeft: number;
}
