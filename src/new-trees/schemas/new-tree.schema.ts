import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  Consumable,
  ConsumableSchema,
} from 'src/consumables/schemas/consumable.schema';
import {
  RawMaterial,
  RawMaterialSchema,
} from 'src/raw-materials/schemas/raw-material.schema';

export type NewTreeDocument = HydratedDocument<NewTree>;

@Schema({ versionKey: false })
export class NewTree {
  @Prop()
  quantity: number;

  @Prop({ type: 'ObjectId', ref: 'Tree' })
  tree: string;

  @Prop({
    type: [{ rate: Number, rawMaterial: RawMaterialSchema }],
  })
  rawMaterialDrops: { rate: number; rawMaterial: RawMaterial }[];

  @Prop({ type: [{ rate: Number, consumable: ConsumableSchema }] })
  consumableDrops: { rate: number; consumable: Consumable }[];
}

export const NewTreeSchema = SchemaFactory.createForClass(NewTree);
