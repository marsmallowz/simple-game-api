import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { NewMonster } from 'src/new-monsters/schemas/new-monster.schema';
import { NewTree } from 'src/new-trees/schemas/new-tree.schema';

export type SubAreaDocument = HydratedDocument<SubArea>;

@Schema({ versionKey: false })
export class SubArea {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop()
  coordinate: number;

  @Prop({ type: [{ type: 'ObjectId', ref: 'NewTree' }] })
  trees: NewTree[];

  @Prop({ type: [{ type: 'ObjectId', ref: 'NewMonster' }] })
  monsters: NewMonster[];

  @Prop({ type: 'ObjectId', ref: 'Area' })
  areaId: string;
}

export const SubAreaSchema = SchemaFactory.createForClass(SubArea);
