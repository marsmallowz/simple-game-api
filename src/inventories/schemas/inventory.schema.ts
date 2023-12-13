import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Equipment } from 'src/equipment/schemas/equipment.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ versionKey: false })
export class Inventory {
  @Prop({
    type: 'ObjectId',
    ref: 'User',
  })
  userId: string;

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

  @Prop({
    type: [
      {
        quantity: Number,
        equipment: { type: 'ObjectId', ref: 'Equipment' },
      },
    ],
  })
  equipments: { quantity: number; equipment: Equipment }[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
