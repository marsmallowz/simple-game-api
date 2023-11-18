import { Injectable } from '@nestjs/common';
import { CreateMonsterDto } from './dto/create-monster.dto';
import { UpdateMonsterDto } from './dto/update-monster.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Monster } from './schemas/monster.schema';
import { Model } from 'mongoose';

@Injectable()
export class MonstersService {
  constructor(
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
  ) {}

  async create(createMonsterDto: CreateMonsterDto) {
    return await this.monsterModel.create(createMonsterDto);
  }

  async findAll(updateMonsterDto: UpdateMonsterDto) {
    const res = await this.monsterModel.find(updateMonsterDto).populate({
      path: 'rawMaterialDrops.rawMaterial',
      model: 'RawMaterial',
    });

    return res;
  }

  async findOne(id: string) {
    return await this.monsterModel.findById(id);
  }

  async update(id: string, updateMonsterDto: UpdateMonsterDto) {
    return await this.monsterModel.findByIdAndUpdate(id, updateMonsterDto);
  }

  async remove(id: string) {
    return await this.monsterModel.findByIdAndDelete(id);
  }
}
