import { Injectable } from '@nestjs/common';
import { CreateNpcDto } from './dto/create-npc.dto';
import { UpdateNpcDto } from './dto/update-npc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NPC } from './schemas/npc.schema';
import { Model } from 'mongoose';

@Injectable()
export class NpcsService {
  constructor(@InjectModel(NPC.name) private npcModel: Model<NPC>) {}

  async create(createNpcDto: CreateNpcDto) {
    return await this.npcModel.create(createNpcDto);
  }

  async findAll(data: { subAreaId: string }) {
    return await this.npcModel.find(data);
  }

  async findOne(id: string) {
    return await this.npcModel.findById(id);
  }

  update(id: number, updateNpcDto: UpdateNpcDto) {
    return `This action updates a #${id} npc`;
  }

  remove(id: number) {
    return `This action removes a #${id} npc`;
  }
}
