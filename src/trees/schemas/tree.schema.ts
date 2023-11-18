import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TreeDocument = HydratedDocument<Tree>;

@Schema({ versionKey: false })
export class Tree {
  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  totalQuantity: number;

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

export const TreeSchema = SchemaFactory.createForClass(Tree);
