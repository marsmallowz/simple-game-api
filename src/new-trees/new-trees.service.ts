import { Injectable } from '@nestjs/common';
import { CreateNewTreeDto } from './dto/create-new-tree.dto';
import { UpdateNewTreeDto } from './dto/update-new-tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NewTree } from './schemas/new-tree.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Inventory } from 'src/inventories/schemas/inventory.schema';

@Injectable()
export class NewTreesService {
  constructor(
    @InjectModel(NewTree.name) private newTreeModel: Model<NewTree>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  generateDropResult({ dropPercentage }: { dropPercentage: number }) {
    const randomValue = Math.random();
    const isDrop = randomValue < dropPercentage;
    return isDrop;
  }

  async reduceQuantity(treeId: string, userId: string) {
    try {
      // kalau gak ditemukan result menjadi null
      const tree = await this.newTreeModel
        .findOneAndUpdate(
          { _id: treeId, quantity: { $gt: 0 } },
          { $inc: { ['quantity']: -1 } },
          { new: true },
        )
        .populate({
          path: 'tree',
          model: 'Tree',
          select: {
            name: true,
          },
        });
      if (tree.quantity === null) {
        throw Error('Quantity Tree 0');
      }

      const user = await this.userModel.findById(userId);
      const userInventory = await this.inventoryModel.findById(user.inventory);
      for (const rawMaterial of tree.rawMaterialDrops) {
        const dropPercentage = rawMaterial.rate;
        const dropped = this.generateDropResult({
          dropPercentage,
        });
        if (dropped) {
          const existingItemIndex = userInventory.rawMaterials.findIndex(
            (item: any) => item.rawMaterial.equals(rawMaterial.rawMaterial),
          );
          if (existingItemIndex !== -1) {
            userInventory.rawMaterials[existingItemIndex].quantity += 1;
          } else {
            userInventory.rawMaterials.push({
              quantity: 1,
              rawMaterial: rawMaterial.rawMaterial,
            });
          }
        }
      }
      await userInventory.save();
      return tree;
    } catch (error) {
      throw Error;
    }
  }

  create(createNewTreeDto: CreateNewTreeDto) {
    return 'This action adds a new newTree';
  }

  findAll() {
    return `This action returns all newTrees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newTree`;
  }

  update(id: number, updateNewTreeDto: UpdateNewTreeDto) {
    return `This action updates a #${id} newTree`;
  }

  remove(id: number) {
    return `This action removes a #${id} newTree`;
  }
}
