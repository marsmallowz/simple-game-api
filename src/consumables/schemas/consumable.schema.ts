import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConsumableDocument = HydratedDocument<Consumable>;

@Schema({ versionKey: false })
export class Consumable {
  @Prop({ unique: true })
  name: string;
}

export const ConsumableSchema = SchemaFactory.createForClass(Consumable);
