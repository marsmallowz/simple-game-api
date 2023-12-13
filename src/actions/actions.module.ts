import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Quest, QuestSchema } from 'src/quests/schemas/quest.schema';
import {
  UserQuest,
  UserQuestSchema,
} from 'src/user-quests/schemas/user-quest.schema';
import {
  Equipment,
  EquipmentSchema,
} from 'src/equipment/schemas/equipment.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Quest.name, schema: QuestSchema },
      { name: UserQuest.name, schema: UserQuestSchema },
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  providers: [ActionsService],
  controllers: [ActionsController],
})
export class ActionsModule {}
