import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Inventory } from 'src/inventories/schemas/inventory.schema';
import { SubArea } from 'src/sub-areas/schemas/sub-area.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

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
    default: new Types.ObjectId('652784523af8cb2c75bfe799'),
  })
  position: SubArea;

  @Prop({
    type: 'ObjectId',
    ref: 'Inventory',
  })
  inventory: Inventory;
}

export const UserSchema = SchemaFactory.createForClass(User);

// gainExp(amount: number): void {
//   this.experience += amount;
//   this.checkLevelUp();
// }

// loseExp(amount: number): void {
//   if (this.experience >= amount) {
//     this.experience -= amount;
//   } else {
//     this.experience = 0;
//   }
// }

// checkLevelUp(): void {
//   const expRequired: number = 100 * Math.pow(2, this.level - 1);
//   if (this.experience >= expRequired) {
//     this.levelUp();
//   }
// }

// levelUp(): void {
//   this.level++;
//   console.log(`Player leveled up to level ${this.level}!`);
// }
