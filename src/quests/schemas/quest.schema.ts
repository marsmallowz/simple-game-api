import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuestType } from '../enums/quest-type.enum';
import { RawMaterial } from 'src/raw-materials/schemas/raw-material.schema';
import { Consumable } from 'src/consumables/schemas/consumable.schema';
import { Equipment } from 'src/equipment/schemas/equipment.schema';
import { Monster } from 'src/monsters/schemas/monster.schema';
import { NPC } from 'src/npcs/schemas/npc.schema';

export type QuestDocument = HydratedDocument<Quest>;

@Schema({ versionKey: false })
export class Quest {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: QuestType,
  })
  type: string;

  @Prop({
    type: [
      {
        quantity: Number,
        rawMaterial: { type: 'ObjectId', ref: 'RawMaterial' },
      },
    ],
  })
  rawMaterialsNeeded: { quantity: number; rawMaterial: RawMaterial }[];

  @Prop({
    type: [
      {
        quantity: Number,
        consumable: { type: 'ObjectId', ref: 'Consumable' },
      },
    ],
  })
  consumablesNeeded: { quantity: number; consumable: Consumable }[];

  @Prop({
    type: [
      {
        quantity: Number,
        rawMaterial: { type: 'ObjectId', ref: 'RawMaterial' },
      },
    ],
  })
  rawMaterialsObtained: { quantity: number; rawMaterial: RawMaterial }[];

  @Prop({
    type: [
      {
        quantity: Number,
        consumable: { type: 'ObjectId', ref: 'Consumable' },
      },
    ],
  })
  consumablesObtained: { quantity: number; consumable: Consumable }[];

  @Prop({
    type: [
      {
        quantity: Number,
        equipment: { type: 'ObjectId', ref: 'Equipment' },
      },
    ],
  })
  equipmentObtained: { quantity: number; equipment: Equipment }[];

  @Prop({
    type: [
      {
        defeat: Number,
        monster: { type: 'ObjectId', ref: 'Monster' },
      },
    ],
  })
  defeatMonsters: {
    defeat: number;
    monster: Monster;
  }[];

  @Prop({ type: 'ObjectId', ref: 'NPC' })
  npcId: NPC;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
