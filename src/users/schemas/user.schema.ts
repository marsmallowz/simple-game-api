import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Equipment } from 'src/equipment/schemas/equipment.schema';
import { Inventory } from 'src/inventories/schemas/inventory.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ default: 5 })
  stamina: number;

  @Prop({ default: 5 })
  currentStamina: number;

  @Prop()
  hp: number;

  @Prop()
  mp: number;

  @Prop()
  currentHp: number;

  @Prop()
  currentMp: number;

  @Prop()
  attack: number;

  @Prop()
  magicAttack: number;

  @Prop()
  defense: number;

  @Prop()
  magicDefense: number;

  @Prop()
  int: number;

  @Prop()
  str: number;

  @Prop()
  vit: number;

  @Prop()
  dex: number;

  @Prop()
  luck: number;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  rightHand: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  leftHand: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  head: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  body: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  rightArm: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  leftArm: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  lowerBody: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  rightLeg: Equipment;

  @Prop({
    type: 'ObjectId',
    ref: 'Equipment',
    default: null,
  })
  leftLeg: Equipment;

  @Prop({ default: 2 })
  pointLeft: number;

  @Prop({ default: 1 })
  experience: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: false })
  verification: boolean;

  @Prop()
  token: string;

  @Prop({
    type: 'ObjectId',
    ref: 'SubArea',
    default: new Types.ObjectId('65548ed9e3d04af57862bf1f'),
  })
  position: string;

  @Prop({
    type: 'ObjectId',
    ref: 'Inventory',
  })
  inventory: Inventory;
}

export const UserSchema = SchemaFactory.createForClass(User);
