import { Injectable } from '@nestjs/common';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tree } from './schemas/tree.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Inventory } from 'src/inventories/schemas/inventory.schema';

@Injectable()
export class TreesService {
  constructor(
    @InjectModel(Tree.name) private treeModel: Model<Tree>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}
  async create(createTreeDto: CreateTreeDto) {
    return await this.treeModel.create(createTreeDto);
  }

  async findAll(updateTreeDto: UpdateTreeDto) {
    return await this.treeModel.find(updateTreeDto);
  }

  async findOne(id: string) {
    return await this.treeModel.findById(id);
  }

  async update(id: string, updateTreeDto: UpdateTreeDto) {
    return await this.treeModel.findByIdAndUpdate(id, updateTreeDto);
  }

  async remove(id: string) {
    return this.treeModel.findByIdAndRemove(id);
  }

  generateDropResult({ dropPercentage }: { dropPercentage: number }) {
    const randomValue = Math.random();
    const isDrop = randomValue < dropPercentage;
    return isDrop;
  }

  async reduceQuantity(treeId: string, userId: string) {
    try {
      // kalau gak ditemukan result menjadi null
      const tree = await this.treeModel.findOneAndUpdate(
        { _id: treeId, quantity: { $gt: 0 } },
        { $inc: { ['quantity']: -1 } },
        { new: true },
      );
      if (tree.quantity === null) {
        throw Error('Quantity Tree 0');
      }

      const user = await this.userModel.findById(userId);
      const inventory = await this.inventoryModel.findById(user.inventory);
      for (const rawMaterial of tree.rawMaterialDrops) {
        const dropPercentage = rawMaterial.rate;
        const dropped = this.generateDropResult({
          dropPercentage,
        });
        if (dropped) {
          const existingItemIndex = inventory.rawMaterials.findIndex(
            (item) =>
              item.rawMaterial.toString() ===
              rawMaterial.rawMaterial.toString(),
          );
          if (existingItemIndex !== -1) {
            inventory.rawMaterials[existingItemIndex].quantity += 1;
          } else {
            inventory.rawMaterials.push({
              quantity: 1,
              rawMaterial: rawMaterial.rawMaterial.toString(),
            });
          }
        }
      }

      for (const consumable of tree.consumableDrops) {
        const dropPercentage = consumable.rate;
        const dropped = this.generateDropResult({
          dropPercentage,
        });
        if (dropped) {
          const existingItemIndex = inventory.consumables.findIndex(
            (item) =>
              item.consumable.toString() === consumable.consumable.toString(),
          );

          if (existingItemIndex !== -1) {
            inventory.consumables[existingItemIndex].quantity += 1;
          } else {
            inventory.consumables.push({
              quantity: 1,
              consumable: consumable.consumable.toString(),
            });
          }
        }
      }
      await inventory.save();
      return tree;
    } catch (error) {
      throw Error;
    }
  }
}
