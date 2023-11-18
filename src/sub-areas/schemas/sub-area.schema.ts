import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubAreaDocument = HydratedDocument<SubArea>;

@Schema({ versionKey: false })
export class SubArea {
  @Prop()
  name: string;

  @Prop()
  coordinate: number;

  @Prop({ type: 'ObjectId', ref: 'Area' })
  areaId: string;
}

export const SubAreaSchema = SchemaFactory.createForClass(SubArea);
