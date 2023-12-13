import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './schemas/inventory.schema';
import { Model } from 'mongoose';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async findAll() {
    return await this.inventoryModel.find();
  }

  async findOne(id: string) {
    try {
      const inventory = await this.inventoryModel
        .findById(id)
        .populate({
          path: 'rawMaterials.rawMaterial',
          model: 'RawMaterial',
        })
        .populate({ path: 'consumables.consumable', model: 'Consumable' })
        .populate({ path: 'equipments.equipment', model: 'Equipment' });
      return inventory;
    } catch (error) {
      throw Error(error);
    }
  }
}
