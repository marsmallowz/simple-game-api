import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonsterDocument = HydratedDocument<Monster>;

@Schema({ versionKey: false })
export class Monster {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  level: number;

  @Prop()
  attack: number;

  @Prop()
  defense: number;

  @Prop()
  hp: number;

  @Prop()
  mp: number;
}

export const MonsterSchema = SchemaFactory.createForClass(Monster);
