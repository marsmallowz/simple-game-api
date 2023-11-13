import { Module } from '@nestjs/common';
import { NewTreesService } from './new-trees.service';
import { NewTreesController } from './new-trees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewTree, NewTreeSchema } from './schemas/new-tree.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NewTree.name, schema: NewTreeSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  controllers: [NewTreesController],
  providers: [NewTreesService],
  exports: [NewTreesService],
})
export class NewTreesModule {}
