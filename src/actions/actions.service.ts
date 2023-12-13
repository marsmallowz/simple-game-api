import { WearEquipmentActionDto } from './dto/wear-equipment-action.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActiveUserData } from 'src/auth/interface/actice-user-data.interface';
import { EquipmentType } from 'src/equipment/enums/equipment-type';
import { Equipment } from 'src/equipment/schemas/equipment.schema';
import { Inventory } from 'src/inventories/schemas/inventory.schema';
import { Quest } from 'src/quests/schemas/quest.schema';
import { UserQuest } from 'src/user-quests/schemas/user-quest.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ActionsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(Quest.name) private questModel: Model<Quest>,
    @InjectModel(UserQuest.name) private userQuestModel: Model<UserQuest>,
    @InjectModel(Equipment.name) private equipmentModel: Model<Equipment>,
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

  async wearEquipment(
    user: ActiveUserData,
    wearEquipmentActionDto: WearEquipmentActionDto,
  ) {
    const inventory = await this.inventoryModel
      .findById(user.inventoryId)
      .populate({ path: 'equipments.equipment', model: 'Equipment' });

    const existingItemIndex = inventory.equipments.findIndex((item: any) => {
      return (
        item.equipment._id.toString() === wearEquipmentActionDto.equipmentId &&
        item.quantity > 0
      );
    });

    if (existingItemIndex === -1) {
      throw new NotFoundException('Equipment not found');
    }
    const equipment = inventory.equipments[existingItemIndex].equipment;
    const userX = await this.userModel.findById(user.sub);
    let currentEquipment = null;
    let secondCurrentEquipment = null;

    const updateFields = {};
    updateFields[`${equipment.type}`] = (equipment as any)._id;
    if (equipment.type === EquipmentType.OneHanded) {
      if (wearEquipmentActionDto.equipmentPosition === 'Right') {
        if (userX.rightHand?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.rightHand;
        userX.rightHand = (equipment as any)._id;
      } else if (wearEquipmentActionDto.equipmentPosition === 'Left') {
        if (userX.leftHand?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.leftHand;
        userX.leftHand = (equipment as any)._id;
      }
    } else if (equipment.type === EquipmentType.DualHanded) {
      if (wearEquipmentActionDto.equipmentPosition === 'Right') {
        if (userX.rightHand?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.rightHand;
        secondCurrentEquipment = userX.leftHand;
        userX.rightHand = (equipment as any)._id;
        userX.leftHand = null;
      } else if (wearEquipmentActionDto.equipmentPosition === 'Left') {
        if (userX.leftHand?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.leftHand;
        secondCurrentEquipment = userX.rightHand;
        userX.leftHand = (equipment as any)._id;
        userX.rightHand = null;
      }
    } else if (equipment.type === EquipmentType.Head) {
      if (userX.head?.toString() === (equipment as any)._id.toString()) {
        throw new BadRequestException('Equipment already wear');
      }
      currentEquipment = userX.head;
      userX.head = (equipment as any)._id;
    } else if (equipment.type === EquipmentType.UpperBody) {
      if (userX.body?.toString() === (equipment as any)._id.toString()) {
        throw new BadRequestException('Equipment already wear');
      }
      currentEquipment = userX.body;
      userX.body = (equipment as any)._id;
    } else if (equipment.type === EquipmentType.LowerBody) {
      if (userX.lowerBody?.toString() === (equipment as any)._id.toString()) {
        throw new BadRequestException('Equipment already wear');
      }
      currentEquipment = userX.lowerBody;
      userX.lowerBody = (equipment as any)._id;
    } else if (equipment.type === EquipmentType.Arm) {
      if (wearEquipmentActionDto.equipmentPosition === 'Left') {
        if (userX.leftArm?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.leftArm;
        userX.leftArm = (equipment as any)._id;
      } else if (wearEquipmentActionDto.equipmentPosition === 'Right') {
        if (userX.rightArm?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.rightArm;
        userX.rightArm = (equipment as any)._id;
      }
    } else if (equipment.type === EquipmentType.Leg) {
      if (wearEquipmentActionDto.equipmentPosition === 'Left') {
        if (userX.leftLeg?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.leftLeg;
        userX.leftLeg = (equipment as any)._id;
      } else if (wearEquipmentActionDto.equipmentPosition === 'Right') {
        if (userX.rightLeg?.toString() === (equipment as any)._id.toString()) {
          throw new BadRequestException('Equipment already wear');
        }
        currentEquipment = userX.rightLeg;
        userX.rightLeg = (equipment as any)._id;
      }
    }
    if (currentEquipment) {
      const existingEquipmentIndex = inventory.equipments.findIndex(
        (item: any) => {
          return (
            item.equipment._id.toString() === currentEquipment &&
            item.quantity > 0
          );
        },
      );
      if (existingEquipmentIndex !== -1) {
        inventory.equipments[existingEquipmentIndex].quantity += 1;
      } else {
        inventory.equipments.push({
          quantity: 1,
          equipment: currentEquipment,
        });
      }
    }
    if (secondCurrentEquipment) {
      const existingEquipmentIndex = inventory.equipments.findIndex(
        (item: any) => {
          return (
            item.equipment._id.toString() === secondCurrentEquipment &&
            item.quantity > 0
          );
        },
      );
      if (existingEquipmentIndex !== -1) {
        inventory.equipments[existingEquipmentIndex].quantity += 1;
      } else {
        inventory.equipments.push({
          quantity: 1,
          equipment: secondCurrentEquipment,
        });
      }
    }

    await userX.save();
    const newUser = await this.userModel.findByIdAndUpdate(
      user.sub,
      {
        $inc: {
          attack: inventory.equipments[existingItemIndex].equipment.attack,
          defense: inventory.equipments[existingItemIndex].equipment.defense,
          magicAttack:
            inventory.equipments[existingItemIndex].equipment.magicAttack,
          magicDefense:
            inventory.equipments[existingItemIndex].equipment.magicDefense,
        },
      },
      { new: true },
    );

    inventory.equipments[existingItemIndex].quantity -= 1;
    if (inventory.equipments[existingItemIndex].quantity <= 0) {
      inventory.equipments.splice(existingItemIndex, 1);
    }

    await inventory.save();

    return {
      attack: newUser.attack,
      magicAttack: newUser.magicAttack,
      defense: newUser.defense,
      magicDefense: newUser.magicDefense,
    };
  }

  async unWearEquipment(
    user: ActiveUserData,
    wearEquipmentActionDto: WearEquipmentActionDto,
  ) {
    const userX = await this.userModel.findById(user.sub);
    const equipment = await this.equipmentModel.findById(
      wearEquipmentActionDto.equipmentId,
    );

    const checkAndUnsetEquipment = async (
      equipmentType: EquipmentType,
      bodyPart: string,
    ) => {
      if (userX[bodyPart]?.toString() !== equipment._id.toString()) {
        throw new NotFoundException('Equipment not found');
      }
      userX[bodyPart] = null;

      const inventory = await this.inventoryModel
        .findById(user.inventoryId)
        .populate({ path: 'equipments.equipment', model: 'Equipment' });

      const existingEquipmentIndex = inventory.equipments.findIndex(
        (item: any) => {
          return (
            item.equipment._id.toString() === equipment._id.toString() &&
            item.quantity > 0
          );
        },
      );
      if (existingEquipmentIndex !== -1) {
        inventory.equipments[existingEquipmentIndex].quantity += 1;
      } else {
        inventory.equipments.push({
          quantity: 1,
          equipment: equipment,
        });
      }
      await userX.save();
      await inventory.save();
      const newUser = await this.userModel.findByIdAndUpdate(
        user.sub,
        {
          $inc: {
            attack: -equipment.attack,
            defense: -equipment.defense,
            magicAttack: -equipment.magicAttack,
            magicDefense: -equipment.magicDefense,
          },
        },
        { new: true },
      );

      return {
        status: {
          attack: newUser.attack,
          magicAttack: newUser.magicAttack,
          defense: newUser.defense,
          magicDefense: newUser.magicDefense,
        },
        equipment:
          inventory.equipments[
            existingEquipmentIndex !== -1
              ? existingEquipmentIndex
              : inventory.equipments.length - 1
          ],
      };
    };

    switch (equipment.type) {
      case EquipmentType.Head:
        await checkAndUnsetEquipment(EquipmentType.Head, 'head');
        break;
      case EquipmentType.UpperBody:
        await checkAndUnsetEquipment(EquipmentType.UpperBody, 'body');
        break;
      case EquipmentType.LowerBody:
        await checkAndUnsetEquipment(EquipmentType.LowerBody, 'lowerBody');
        break;
      case EquipmentType.OneHanded:
        if (wearEquipmentActionDto.equipmentPosition === 'Right') {
          const result = await checkAndUnsetEquipment(
            EquipmentType.OneHanded,
            'rightHand',
          );
          return result;
        } else if (wearEquipmentActionDto.equipmentPosition === 'Left') {
          const result = await checkAndUnsetEquipment(
            EquipmentType.OneHanded,
            'leftHand',
          );
          return result;
        }
        break;
      case EquipmentType.DualHanded:
        if (wearEquipmentActionDto.equipmentPosition === 'Right') {
          await checkAndUnsetEquipment(EquipmentType.DualHanded, 'rightHand');
        } else if (wearEquipmentActionDto.equipmentPosition === 'Left') {
          await checkAndUnsetEquipment(EquipmentType.DualHanded, 'leftHand');
        }
        break;
      case EquipmentType.Arm:
        if (wearEquipmentActionDto.equipmentPosition === 'Left') {
          await checkAndUnsetEquipment(EquipmentType.Arm, 'leftArm');
        } else if (wearEquipmentActionDto.equipmentPosition === 'Right') {
          checkAndUnsetEquipment(EquipmentType.Arm, 'rightArm');
        }
        break;
      case EquipmentType.Leg:
        if (wearEquipmentActionDto.equipmentPosition === 'Left') {
          checkAndUnsetEquipment(EquipmentType.Leg, 'leftLeg');
        } else if (wearEquipmentActionDto.equipmentPosition === 'Right') {
          checkAndUnsetEquipment(EquipmentType.Leg, 'rightLeg');
        }
        break;
      default:
        throw new BadRequestException('Invalid equipment type');
    }
  }

  async takeQuest(user: ActiveUserData, questId: string) {
    const userQuest = await this.userQuestModel.findOne({
      userId: user.sub,
      questId: questId,
      complete: false,
    });

    if (userQuest) {
      throw new ConflictException('Already take the quest');
    }

    const quest = await this.questModel.findById(questId).populate([
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

    const progress = quest.defeatMonsters.map((defeatMonster) => {
      return {
        currentDefeat: 0,
        totalDefeat: defeatMonster.defeat,
        monster: defeatMonster.monster,
      };
    });

    const createUserQuest = await this.userQuestModel.create({
      userId: user.sub,
      questId: questId,
      progress: progress,
    });

    return createUserQuest;
  }

  async reportQuest(user: ActiveUserData, userQuestId: string, npcId: string) {
    const userQuest = await this.userQuestModel.findById(userQuestId).populate([
      {
        path: 'questId',
        model: 'Quest',
        populate: [
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
        ],
      },
    ]);

    if (userQuest.complete) {
      throw new BadRequestException('Quest has been report');
    }

    if (user.sub !== userQuest.userId.toString()) {
      throw new UnauthorizedException('Its not your quest');
    }

    if (userQuest.questId.npcId.toString() !== npcId) {
      throw new NotFoundException('Wrong npc to report');
    }

    const condition = userQuest.progress.every(
      (defeatMonster) =>
        defeatMonster.currentDefeat >= defeatMonster.totalDefeat,
    );

    if (!condition) {
      throw new BadRequestException('Quest still on progress');
    }
    const inventory = await this.inventoryModel.findById(user.inventoryId);
    for (const consumable of userQuest.questId.consumablesObtained) {
      const existingItemIndex = inventory.consumables.findIndex((item) => {
        return (
          item.consumable.toString() ===
          (consumable.consumable as any)._id.toString()
        );
      });
      if (existingItemIndex !== -1) {
        inventory.consumables[existingItemIndex].quantity +=
          consumable.quantity;
      } else {
        inventory.consumables.push({
          quantity: consumable.quantity,
          consumable: (consumable.consumable as any)._id,
        });
      }
    }

    for (const rawMaterial of userQuest.questId.rawMaterialsObtained) {
      const existingItemIndex = inventory.rawMaterials.findIndex((item) => {
        return (
          item.rawMaterial.toString() ===
          (rawMaterial.rawMaterial as any)._id.toString()
        );
      });

      if (existingItemIndex !== -1) {
        inventory.rawMaterials[existingItemIndex].quantity +=
          rawMaterial.quantity;
      } else {
        inventory.rawMaterials.push({
          quantity: rawMaterial.quantity,
          rawMaterial: (rawMaterial.rawMaterial as any)._id,
        });
      }
    }

    for (const equipment of userQuest.questId.equipmentObtained) {
      const existingItemIndex = inventory.equipments.findIndex((item) => {
        return (
          item.equipment.toString() ===
          (equipment.equipment as any)._id.toString()
        );
      });

      if (existingItemIndex !== -1) {
        inventory.equipments[existingItemIndex].quantity += equipment.quantity;
      } else {
        inventory.equipments.push({
          quantity: equipment.quantity,
          equipment: equipment.equipment,
        });
      }
    }

    await inventory.save();
    userQuest.complete = true;
    await userQuest.save();
    return userQuest;
  }
}
