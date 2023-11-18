import { Injectable } from '@nestjs/common';
import { CreateConsumableDto } from './dto/create-consumable.dto';
import { UpdateConsumableDto } from './dto/update-consumable.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Consumable } from './schemas/consumable.schema';
import { Model } from 'mongoose';

@Injectable()
export class ConsumablesService {
  constructor(
    @InjectModel(Consumable.name) private consumableModel: Model<Consumable>,
  ) {}

  async create(createConsumableDto: CreateConsumableDto) {
    return await this.consumableModel.create(createConsumableDto);
  }

  findAll() {
    return `This action returns all consumables`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consumable`;
  }

  update(id: number, updateConsumableDto: UpdateConsumableDto) {
    return `This action updates a #${id} consumable`;
  }

  remove(id: number) {
    return `This action removes a #${id} consumable`;
  }
}
