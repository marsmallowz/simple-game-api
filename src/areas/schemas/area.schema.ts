import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SubArea } from 'src/sub-areas/schemas/sub-area.schema';

export type AreaDocument = HydratedDocument<Area>;

@Schema({ versionKey: false })
export class Area {
  @Prop({ unique: true })
  name: string;

  @Prop()
  column: number;

  @Prop({ type: [{ type: 'ObjectId', ref: 'SubArea' }] })
  subAreas: SubArea[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
