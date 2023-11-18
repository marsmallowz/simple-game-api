import { FindSubAreaDto } from './dto/find-sub-area.dto';
import { Injectable } from '@nestjs/common';
import { CreateSubAreaDto } from './dto/create-sub-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubArea } from './schemas/sub-area.schema';
import { Model } from 'mongoose';
import { SubAreaRoomsService } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.service';
import { UpdateSubAreaDto } from './dto/update-sub-area.dto';

@Injectable()
export class SubAreasService {
  constructor(
    @InjectModel(SubArea.name) private subAreaModel: Model<SubArea>,
    private readonly subAreaRoomsService: SubAreaRoomsService,
  ) {}

  async create(createSubAreaDto: CreateSubAreaDto) {
    return await this.subAreaModel.create(createSubAreaDto);
  }

  async findAll(findSubAreaDto: FindSubAreaDto) {
    return await this.subAreaModel.find(findSubAreaDto);
  }

  async findOne(id: string) {
    return await this.subAreaModel.findById(id);
  }

  async findOneBasic(id: string) {
    const result = await this.subAreaModel.findById(id);
    const users = this.subAreaRoomsService.subAreaRooms.get(id);
    return {
      subAreaDetails: result,
      users: users,
    };
  }

  update(id: string, updateSubAreaDto: UpdateSubAreaDto) {
    return `This action updates a #${id} subArea`;
  }

  remove(id: number) {
    return `This action removes a #${id} subArea`;
  }
}
