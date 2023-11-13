import { TreeSchema } from './../trees/schemas/tree.schema';
import { Module } from '@nestjs/common';
import { SubAreasService } from './sub-areas.service';
import { SubAreasController } from './sub-areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubArea, SubAreaSchema } from './schemas/sub-area.schema';
import { Tree } from 'src/trees/schemas/tree.schema';
import { NewTree, NewTreeSchema } from 'src/new-trees/schemas/new-tree.schema';
import {
  NewMonster,
  NewMonsterSchema,
} from 'src/new-monsters/schemas/new-monster.schema';
import { Monster, MonsterSchema } from 'src/monsters/schemas/monster.schema';
import { SubAreaRoomsModule } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubArea.name, schema: SubAreaSchema }]),
    MongooseModule.forFeature([{ name: Tree.name, schema: TreeSchema }]),
    MongooseModule.forFeature([{ name: NewTree.name, schema: NewTreeSchema }]),
    MongooseModule.forFeature([{ name: Monster.name, schema: MonsterSchema }]),
    MongooseModule.forFeature([
      { name: NewMonster.name, schema: NewMonsterSchema },
    ]),
    SubAreaRoomsModule,
  ],
  controllers: [SubAreasController],
  providers: [SubAreasService],
  exports: [SubAreasService],
})
export class SubAreasModule {}
