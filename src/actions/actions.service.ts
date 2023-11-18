import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActiveUserData } from 'src/auth/interface/actice-user-data.interface';
import { Inventory } from 'src/inventories/schemas/inventory.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async useConsumable(user: ActiveUserData, consumableId: string) {
    // alasan menggunakan any karena type inventory tepatnya di consumables.consumable yang sbelumnya string
    // berubah karena melakukan populate consumables.consumable berubah menjadi object
    const inventory: any = await this.inventoryModel
      .findById(user.inventoryId)
      .populate({ path: 'consumables.consumable', model: 'Consumable' });
    const existingItemIndex = inventory.consumables.findIndex((item: any) => {
      return (
        item.consumable._id.toString() === consumableId && item.quantity > 0
      );
    });
    if (existingItemIndex === -1) {
      throw new NotFoundException('Consumable not found');
    }
    if ('health' in inventory.consumables[existingItemIndex].consumable) {
      inventory.consumables[existingItemIndex].quantity -= 1;

      const userX = await this.userModel.findByIdAndUpdate(
        user.sub,
        {
          $inc: {
            currentHp:
              inventory.consumables[existingItemIndex].consumable.health,
          },
        },
        { new: true },
      );

      if (userX.currentHp > userX.hp) {
        userX.currentHp = userX.hp;
        await userX.save();
      }

      if (inventory.consumables[existingItemIndex].quantity <= 0) {
        inventory.consumables.splice(existingItemIndex, 1);
      }

      await inventory.save();
      return { currentHp: userX.currentHp };
    } else {
      throw new NotFoundException('Consumable not found');
    }
  }
}
