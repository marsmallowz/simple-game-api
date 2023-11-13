import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schemas/area.schema';
import { Model } from 'mongoose';
import { SubArea } from 'src/sub-areas/schemas/sub-area.schema';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(SubArea.name) private subAreaModel: Model<SubArea>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    // Simpan area
    const area = await this.areaModel.create({
      name: createAreaDto.name,
      column: createAreaDto.column,
    });

    // Simpan subAreas dengan merujuk ke area
    const subAreaPromises = createAreaDto.subAreas.map((subArea) => {
      return new this.subAreaModel({
        name: subArea.name,
        coordinate: subArea.coordinate,
        areaId: area._id,
      })
        .save()
        .then((savedSubArea) => savedSubArea);
    });

    // tunggu hingga semua subArea selesai disimpan
    const savedSubAreas = await Promise.all(subAreaPromises);

    // yang kesimpan hanya id
    area.subAreas = savedSubAreas;
    await area.save();

    // Ambil ulang data area dengan subAreas yang sudah disimpan
    return this.areaModel.findById(area._id).populate('subAreas').exec();
  }

  findAll() {
    return `This action returns all areas`;
  }

  async findOne(id: string) {
    const area = await this.areaModel.findById(id).populate('subAreas').exec();
    return area;
  }

  // update(id: number, updateAreaDto: UpdateAreaDto) {
  //   return `This action updates a #${id} area`;
  // }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
