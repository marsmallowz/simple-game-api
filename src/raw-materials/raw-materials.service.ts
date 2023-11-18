import { Injectable } from '@nestjs/common';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RawMaterial } from './schemas/raw-material.schema';
import { Model } from 'mongoose';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectModel(RawMaterial.name) private rawMaterialModel: Model<RawMaterial>,
  ) {}

  async create(createRawMaterialDto: CreateRawMaterialDto) {
    return await this.rawMaterialModel.create(createRawMaterialDto);
  }

  async findAll() {
    return await this.rawMaterialModel.find();
  }

  async findOne(id: string) {
    return await this.rawMaterialModel.findById(id);
  }

  async update(id: string, updateRawMaterialDto: UpdateRawMaterialDto) {
    return await this.rawMaterialModel.findByIdAndUpdate(
      id,
      updateRawMaterialDto,
    );
  }

  async remove(id: string) {
    return await this.rawMaterialModel.findByIdAndRemove(id);
  }
}
