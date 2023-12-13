import { Injectable } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Quest } from './schemas/quest.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestsService {
  constructor(@InjectModel(Quest.name) private questModel: Model<Quest>) {}

  async create(createQuestDto: CreateQuestDto) {
    return await this.questModel.create(createQuestDto);
  }

  async findAll(data: { npcId: string }) {
    const result = await this.questModel.find(data).populate([
      {
        path: 'rawMaterialsNeeded.rawMaterial',
        model: 'RawMaterial',
      },
      {
        path: 'consumablesNeeded.consumable',
        model: 'Consumable',
      },
      {
        path: 'rawMaterialsObtained.rawMaterial',
        model: 'RawMaterial',
      },
      {
        path: 'consumablesObtained.consumable',
        model: 'Consumable',
      },
    ]);
    return result;
  }

  async findOne(id: string) {
    return await this.questModel.findById(id).populate([
      {
        path: 'rawMaterialsNeeded.rawMaterial',
        model: 'RawMaterial',
      },
      {
        path: 'consumablesNeeded.consumable',
        model: 'Consumable',
      },
      {
        path: 'rawMaterialsObtained.rawMaterial',
        model: 'RawMaterial',
      },
      {
        path: 'consumablesObtained.consumable',
        model: 'Consumable',
      },
      {
        path: 'equipmentObtained.equipment',
        model: 'Equipment',
      },
      {
        path: 'defeatMonsters.monster',
        model: 'Monster',
      },
    ]);
  }

  update(id: number, updateQuestDto: UpdateQuestDto) {
    return `This action updates a #${id} quest`;
  }

  remove(id: number) {
    return `This action removes a #${id} quest`;
  }
}
