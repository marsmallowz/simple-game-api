import { Module } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { MonstersController } from './monsters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Monster, MonsterSchema } from './schemas/monster.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Monster.name, schema: MonsterSchema }]),
  ],
  controllers: [MonstersController],
  providers: [MonstersService],
  exports: [MonstersService],
})
export class MonstersModule {}
