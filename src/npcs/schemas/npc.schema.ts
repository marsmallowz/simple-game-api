import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NPCDocument = HydratedDocument<NPC>;

@Schema({ versionKey: false })
export class NPC {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  talk: string;

  @Prop({
    type: 'ObjectId',
    ref: 'SubArea',
  })
  subAreaId: string;
}

export const NPCSchema = SchemaFactory.createForClass(NPC);
