import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EquipmentType } from '../enums/equipment-type';
import { EquipmentRarity } from '../enums/equipment-rarity';

export type EquipmentDocument = HydratedDocument<Equipment>;

@Schema({ versionKey: false })
export class Equipment {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: EquipmentType,
  })
  type: string;

  @Prop({
    type: String,
    enum: EquipmentRarity,
  })
  rarity: string;

  @Prop()
  attack: number;

  @Prop()
  defense: number;

  @Prop()
  magicAttack: number;

  @Prop()
  magicDefense: number;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
