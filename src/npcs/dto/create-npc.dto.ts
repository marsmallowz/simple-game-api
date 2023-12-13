import { IsString } from 'class-validator';

export class CreateNpcDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  talk: string;

  @IsString()
  subAreaId: string;
}
