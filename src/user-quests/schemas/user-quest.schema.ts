import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Monster } from 'src/monsters/schemas/monster.schema';
import { Quest } from 'src/quests/schemas/quest.schema';
import { User } from 'src/users/schemas/user.schema';

export type UserQuestDocument = HydratedDocument<UserQuest>;

@Schema({ versionKey: false })
export class UserQuest {
  @Prop({ default: false })
  complete: boolean;

  @Prop({
    type: [
      {
        currentDefeat: Number,
        totalDefeat: Number,
        monster: { type: 'ObjectId', ref: 'Monster' },
      },
    ],
  })
  progress: { currentDefeat: number; totalDefeat: number; monster: Monster }[];

  @Prop({ type: 'ObjectId', ref: 'Quest' })
  questId: Quest;

  @Prop({ type: 'ObjectId', ref: 'User' })
  userId: User;
}

export const UserQuestSchema = SchemaFactory.createForClass(UserQuest);
