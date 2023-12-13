import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Monster } from 'src/monsters/schemas/monster.schema';
import { Tree } from 'src/trees/schemas/tree.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
    @InjectModel(Tree.name) private treeModel: Model<Tree>,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 */5 * * * *')
  async raiseMonsters() {
    await this.monsterModel.updateMany({ currentHp: 0 }, [
      { $set: { currentHp: '$totalHp' } },
    ]);
    this.logger.debug('Called every 5 minute to raise monsters');
  }

  @Cron('0 */10 * * * *')
  async raiseTrees() {
    await this.treeModel.updateMany({}, [
      {
        $set: {
          quantity: {
            $cond: {
              if: { $lt: ['$quantity', '$totalQuantity'] },
              then: { $add: ['$quantity', 1] },
              else: '$quantity',
            },
          },
        },
      },
    ]);
    this.logger.debug('Called every 10 minute to increment trees');
  }
}
