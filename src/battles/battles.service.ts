import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Inventory } from 'src/inventories/schemas/inventory.schema';
import { Monster } from 'src/monsters/schemas/monster.schema';
import { RawMaterial } from 'src/raw-materials/schemas/raw-material.schema';
import { UserQuest } from 'src/user-quests/schemas/user-quest.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class BattlesService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterial>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(UserQuest.name) private userQuestModel: Model<UserQuest>,
  ) {}

  async calculateExpAndDrop({
    damage,
    userId,
    monsterId,
  }: {
    damage: number;
    userId: string;
    monsterId: string;
  }) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const monster = await this.monsterModel
        .findById(monsterId)
        .populate({
          path: 'rawMaterialDrops.rawMaterial',
          model: 'RawMaterial',
        })
        .session(session);

      const exp = Math.round((damage / monster.totalHp) * monster.experience);
      const user = await this.userModel.findById(userId).session(session);
      let myLevel = user.level;
      let levelUp = false;
      let myPointLeft = user.pointLeft;

      const totalExp = user.experience + exp;
      const expRequired: number = 100 * Math.pow(2, user.level - 1);

      if (totalExp >= expRequired) {
        do {
          myLevel++;
          levelUp = true;
          myPointLeft += 2;
        } while (totalExp >= 100 * Math.pow(2, myLevel - 1));
        console.log(`Player leveled up to level ${myLevel}!`);
        await this.userModel
          .findByIdAndUpdate(
            userId,
            {
              $inc: {
                experience: exp,
                level: myLevel - user.level,
                pointLeft: myPointLeft - user.pointLeft,
              },
            },
            { new: true },
          )
          .session(session);
      } else {
        await this.userModel
          .findByIdAndUpdate(
            userId,
            { $inc: { experience: exp } },
            { new: true },
          )
          .session(session);
      }
      const userInventory = await this.inventoryModel
        .findById(user.inventory)
        .session(session);
      const item: any[] = [];
      for (const rawMaterial of monster.rawMaterialDrops) {
        const contribution = (damage / monster.totalHp) * 0.125;
        const successPercentage = rawMaterial.rate;
        const dropped = this.generateRandomResult({
          successPercentage,
          contribution,
        });
        if (dropped) {
          const existingItemIndex = userInventory.rawMaterials.findIndex(
            (item) => {
              return (
                item.rawMaterial.toString() ===
                (rawMaterial as any).rawMaterial._id.toString()
              );
            },
          );
          if (existingItemIndex !== -1) {
            userInventory.rawMaterials[existingItemIndex].quantity += 1;
          } else {
            userInventory.rawMaterials.push({
              quantity: 1,
              rawMaterial: rawMaterial.rawMaterial,
            });
          }
          item.push(rawMaterial.rawMaterial);
        }
      }

      await this.userQuestModel.updateMany(
        {
          complete: false,
          'progress.monster': monsterId,
          userId: userId,
        },
        {
          $inc: { 'progress.$.currentDefeat': 1 },
        },
      );

      await user.save();
      await userInventory.save();
      await session.commitTransaction();
      session.endSession();

      return {
        exp,
        item,
        levelUp,
        level: myLevel,
        pointLeft: myPointLeft,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  generateRandomResult({
    successPercentage,
    contribution,
  }: {
    successPercentage: number;
    contribution: number;
  }) {
    const randomValue = Math.random() - contribution;
    const successThreshold = successPercentage;
    const isSuccess = randomValue < successThreshold;
    return isSuccess;
  }

  async attackMonster({
    userId,
    monsterId,
  }: {
    userId: string;
    monsterId: string;
  }) {
    const user = await this.userModel.findById(userId);
    const monster = await this.monsterModel.findById(monsterId);
    let damage = user.attack;
    monster.currentHp -= damage;
    if (monster.currentHp < 0) {
      damage += monster.currentHp;
      monster.currentHp = 0;
    }
    await monster.save();
    return { monster, damage };
  }

  async monsterAttack({
    userId,
    monsterId,
  }: {
    userId: string;
    monsterId: string;
  }) {
    const monster = await this.monsterModel.findById(monsterId);
    const result = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { currentHp: -monster.attack } },
      { new: true },
    );
    if (result.currentHp < 0) {
      result.currentHp = 0;
      await result.save();
    }
    return { user: result, monster: monster };
  }
}
