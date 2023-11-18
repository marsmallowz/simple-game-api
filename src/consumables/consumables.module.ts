import { Module } from '@nestjs/common';
import { ConsumablesService } from './consumables.service';
import { ConsumablesController } from './consumables.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Consumable, ConsumableSchema } from './schemas/consumable.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consumable.name, schema: ConsumableSchema },
    ]),
  ],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
})
export class ConsumablesModule {}
