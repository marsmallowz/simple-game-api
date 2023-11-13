import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Consumable } from 'src/consumables/schemas/consumable.schema';
import {
  RawMaterial,
  RawMaterialSchema,
} from 'src/raw-materials/schemas/raw-material.schema';

export type NewMonsterDocument = HydratedDocument<NewMonster>;

@Schema({ versionKey: false })
export class NewMonster {
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

  @Prop({ type: 'ObjectId', ref: 'Monster' })
  monster: string;

  @Prop({
    type: [{ rate: Number, rawMaterial: RawMaterialSchema }],
  })
  rawMaterialDrops: { rate: number; rawMaterial: RawMaterial }[];

  @Prop({ type: [{ type: 'ObjectId', ref: 'Consumable' }] })
  consumableDrops: Consumable[];
}
export const NewMonsterSchema = SchemaFactory.createForClass(NewMonster);
