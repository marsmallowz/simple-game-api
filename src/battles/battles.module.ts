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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monster.name, schema: MonsterSchema },
      { name: User.name, schema: UserSchema },
      { name: RawMaterial.name, schema: RawMaterialSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  providers: [BattlesService],
  controllers: [BattlesController],
  exports: [BattlesService],
})
export class BattlesModule {}
