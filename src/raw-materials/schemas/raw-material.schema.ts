import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RawMaterialDocument = HydratedDocument<RawMaterial>;

@Schema({ versionKey: false })
export class RawMaterial {
  @Prop()
  name: string;
}

export const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);
