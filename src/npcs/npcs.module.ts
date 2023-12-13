import { Module } from '@nestjs/common';
import { NpcsService } from './npcs.service';
import { NpcsController } from './npcs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NPC, NPCSchema } from './schemas/npc.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: NPC.name, schema: NPCSchema }])],
  controllers: [NpcsController],
  providers: [NpcsService],
})
export class NpcsModule {}
