import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TreeDocument = HydratedDocument<Tree>;

@Schema({ versionKey: false })
export class Tree {
  @Prop({ unique: true, required: true })
  name: string;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
