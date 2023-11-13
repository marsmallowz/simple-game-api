/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const result = await this.userModel.findById(id);
    return result;
  }

  async findOneById(id: string) {
    const result = await this.userModel
      .findById(id, '_id email position')
      .populate('position')
      .exec();
    return result;
  }

  async updateUsersPosition(email: string, position: string) {
    const result = await this.userModel.findOneAndUpdate(
      {
        email: email,
      },
      { position: position },
      { new: true, select: 'email' },
    );
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    let pointCost = 0;
    console.log(updateUserDto);
    if (updateUserDto.str) {
      if (user.str <= updateUserDto.str) {
        pointCost += updateUserDto.str - user.str;
        const { attack } = increaseStr(updateUserDto.str - user.str);
        updateUserDto.attack = user.attack + attack;
      } else {
        updateUserDto.str = user.str;
      }
    }
    if (updateUserDto.int) {
      if (user.int <= updateUserDto.int) {
        pointCost += updateUserDto.int - user.int;
        const { mp, magicAttack, magicDefense } = increaseInt(
          updateUserDto.int - user.int,
        );
        if (updateUserDto.currentMp === updateUserDto.mp) {
          updateUserDto.currentMp = user.currentMp + mp;
        }
        updateUserDto.mp = user.mp + mp;
        updateUserDto.magicAttack = user.magicAttack + magicAttack;
        updateUserDto.magicDefense = user.magicDefense + magicDefense;
      } else {
        updateUserDto.int = user.int;
      }
    }
    if (updateUserDto.vit) {
      if (user.vit <= updateUserDto.vit) {
        pointCost += updateUserDto.vit - user.vit;
        const { hp, defense } = increaseVit(updateUserDto.vit - user.vit);
        if (updateUserDto.currentHp === updateUserDto.hp) {
          updateUserDto.currentHp = user.currentHp + hp;
        }
        updateUserDto.hp = user.hp + hp;
        updateUserDto.defense = user.defense + defense;
      } else {
        updateUserDto.vit = user.vit;
      }
    }
    if (updateUserDto.dex) {
      if (user.dex <= updateUserDto.dex) {
        pointCost += updateUserDto.dex - user.dex;
      } else {
        updateUserDto.dex = user.dex;
      }
    }
    if (updateUserDto.luck) {
      if (user.luck <= updateUserDto.luck) {
        pointCost += updateUserDto.luck - user.luck;
      } else {
        updateUserDto.luck = user.luck;
      }
    }
    if (user.pointLeft >= pointCost) {
      updateUserDto.pointLeft = user.pointLeft - pointCost;
    }
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

function increaseVit(vit: number) {
  const hp = vit * 5;
  const defense = vit * 2;
  return { hp, defense };
}

function increaseInt(int: number) {
  const mp = int * 2;
  const magicAttack = int * 2;
  const magicDefense = int * 1;
  return { mp, magicAttack, magicDefense };
}

function increaseStr(str: number) {
  const attack = str * 3;
  return { attack };
}
