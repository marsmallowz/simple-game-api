import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ versionKey: false })
export class Inventory {
  @Prop({
    type: [
      {
        quantity: Number,
        rawMaterial: { type: 'ObjectId', ref: 'RawMaterial' },
      },
    ],
  })
  rawMaterials: { quantity: number; rawMaterial: string }[];

  @Prop({
    type: [
      {
        quantity: Number,
        consumable: { type: 'ObjectId', ref: 'Consumable' },
      },
    ],
  })
  consumables: { quantity: number; consumable: string }[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
