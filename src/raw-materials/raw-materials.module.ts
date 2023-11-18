import { Module } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { RawMaterialsController } from './raw-materials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RawMaterial, RawMaterialSchema } from './schemas/raw-material.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterial.name, schema: RawMaterialSchema },
    ]),
  ],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService],
})
export class RawMaterialsModule {}
