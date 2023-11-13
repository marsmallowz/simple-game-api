import { Module } from '@nestjs/common';
import { NewMonstersService } from './new-monsters.service';
import { NewMonstersController } from './new-monsters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewMonster, NewMonsterSchema } from './schemas/new-monster.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  RawMaterial,
  RawMaterialSchema,
} from 'src/raw-materials/schemas/raw-material.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewMonster.name, schema: NewMonsterSchema },
      { name: User.name, schema: UserSchema },
      { name: RawMaterial.name, schema: RawMaterialSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  controllers: [NewMonstersController],
  providers: [NewMonstersService],
  exports: [NewMonstersService],
})
export class NewMonstersModule {}
