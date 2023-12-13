import { Module } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  RawMaterial,
  RawMaterialSchema,
} from 'src/raw-materials/schemas/raw-material.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';
import { Monster, MonsterSchema } from 'src/monsters/schemas/monster.schema';
import {
  UserQuest,
  UserQuestSchema,
} from 'src/user-quests/schemas/user-quest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monster.name, schema: MonsterSchema },
      { name: User.name, schema: UserSchema },
      { name: RawMaterial.name, schema: RawMaterialSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: UserQuest.name, schema: UserQuestSchema },
    ]),
  ],
  providers: [BattlesService],
  controllers: [BattlesController],
  exports: [BattlesService],
})
export class BattlesModule {}
