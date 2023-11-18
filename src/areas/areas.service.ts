import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schemas/area.schema';
import { Model } from 'mongoose';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto) {
    return await this.areaModel.create(createAreaDto);
  }

  async findAll() {
    return await this.areaModel.find();
  }

  async findOne(id: string) {
    return await this.areaModel.findById(id);
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    return await this.areaModel.findByIdAndUpdate(id, updateAreaDto);
  }

  async remove(id: number) {
    return await this.areaModel.findByIdAndDelete(id);
  }
}
