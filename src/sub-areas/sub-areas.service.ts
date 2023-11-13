import { Injectable } from '@nestjs/common';
import { CreateSubAreaDto } from './dto/create-sub-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubArea } from './schemas/sub-area.schema';
import { Model } from 'mongoose';
import { Tree } from 'src/trees/schemas/tree.schema';
import { NewTree } from 'src/new-trees/schemas/new-tree.schema';
import { Monster } from 'src/monsters/schemas/monster.schema';
import { NewMonster } from 'src/new-monsters/schemas/new-monster.schema';
import { SubAreaRoomsService } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.service';

@Injectable()
export class SubAreasService {
  constructor(
    @InjectModel(SubArea.name) private subAreaModel: Model<SubArea>,
    @InjectModel(Tree.name) private treeModel: Model<Tree>,
    @InjectModel(NewTree.name) private newTreeModel: Model<NewTree>,
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
    @InjectModel(NewMonster.name) private newMonsterModel: Model<NewMonster>,
    private readonly subAreaRoomsService: SubAreaRoomsService,
  ) {}

  async create(createSubAreaDto: CreateSubAreaDto) {
    const session = await this.subAreaModel.db.startSession();
    session.startTransaction();
    try {
      const subArea = await this.subAreaModel.create({
        name: createSubAreaDto.name,
        coordinate: createSubAreaDto.coordinate,
        areaId: createSubAreaDto.areaId,
      });
      const newTreePromises = createSubAreaDto.trees.map(async (newTree) => {
        const result = await this.treeModel.create({ name: newTree?.name });
        return new this.newTreeModel({
          tree: result,
          quantity: newTree.quantity,
        })
          .save()
          .then((savedNewTree) => savedNewTree);
      });
      const newMonsterPromises = createSubAreaDto.monsters.map(
        async (monster) => {
          const result = await this.monsterModel.create({
            name: monster.name,
            hp: monster.hp,
            mp: monster.mp,
            level: monster.level,
          });
          return new this.newMonsterModel({
            currentHp: result.hp,
            currentMp: result.mp,
            totalHp: result.hp,
            totalMp: result.mp,
            currentLevel: result.level,
            monster: result,
          })
            .save()
            .then((savedNewMonster) => savedNewMonster);
        },
      );

      const savedNewTree = await Promise.all(newTreePromises);
      const savedNewMonster = await Promise.all(newMonsterPromises);

      subArea.trees = savedNewTree;
      subArea.monsters = savedNewMonster;

      await subArea.save();

      return this.subAreaModel
        .findById(subArea._id)
        .populate({
          path: 'trees',
          model: 'NewTree',
          populate: {
            path: 'tree',
            model: 'Tree',
          },
        })
        .exec();
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  findAll() {
    return `This action returns all subAreas`;
  }

  async findOne(id: string) {
    const result = await this.subAreaModel
      .findById(id)
      .populate({
        path: 'trees',
        model: 'NewTree',
        populate: {
          path: 'tree',
          model: 'Tree',
        },
      })
      .populate({
        path: 'monsters',
        model: 'NewMonster',
        populate: {
          path: 'monster',
          model: 'Monster',
          select: {
            name: true,
          },
        },
      })
      .exec();
    const users = this.subAreaRoomsService.subAreaRooms.get(id);
    return {
      subAreaDetails: result,
      users: users,
    };
  }

  async findOneBasic(id: string) {
    return await this.subAreaModel.findById(id);
  }

  // update(id: number, updateSubAreaDto: UpdateSubAreaDto) {
  //   return `This action updates a #${id} subArea`;
  // }

  remove(id: number) {
    return `This action removes a #${id} subArea`;
  }
}
