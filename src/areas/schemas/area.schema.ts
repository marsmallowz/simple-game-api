import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema({ versionKey: false })
export class Area {
  @Prop({ unique: true })
  name: string;

  @Prop()
  column: number;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
