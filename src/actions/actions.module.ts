import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Inventory.name, schema: InventorySchema },
    ]),
  ],
  providers: [ActionsService],
  controllers: [ActionsController],
})
export class ActionsModule {}
