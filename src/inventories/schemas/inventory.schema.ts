import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  RawMaterial,
  RawMaterialSchema,
} from 'src/raw-materials/schemas/raw-material.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({ versionKey: false })
export class Inventory {
  @Prop({
    type: [{ quantity: Number, rawMaterial: RawMaterialSchema }],
  })
  rawMaterials: { quantity: number; rawMaterial: RawMaterial }[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
