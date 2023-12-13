import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonsterDocument = HydratedDocument<Monster>;

@Schema({ versionKey: false })
export class Monster {
  @Prop()
  name: string;

  @Prop()
  totalHp: number;

  @Prop()
  totalMp: number;

  @Prop()
  currentHp: number;

  @Prop()
  currentMp: number;

  @Prop()
  currentLevel: number;

  @Prop()
  attack: number;

  @Prop()
  defense: number;

  @Prop()
  experience: number;

  @Prop({ type: 'ObjectId', ref: 'SubArea' })
  subAreaId: string;

  @Prop({
    type: [
      { rate: Number, rawMaterial: { type: 'ObjectId', ref: 'RawMaterial' } },
    ],
  })
  rawMaterialDrops: { rate: number; rawMaterial: string }[];

  @Prop({
    type: [
      { rate: Number, consumable: { type: 'ObjectId', ref: 'Consumable' } },
    ],
  })
  consumableDrops: { rate: number; consumable: string }[];
}

export const MonsterSchema = SchemaFactory.createForClass(Monster);
