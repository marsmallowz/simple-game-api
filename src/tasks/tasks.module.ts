import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monster, MonsterSchema } from 'src/monsters/schemas/monster.schema';
import { Tree, TreeSchema } from 'src/trees/schemas/tree.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monster.name, schema: MonsterSchema },
      { name: Tree.name, schema: TreeSchema },
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
