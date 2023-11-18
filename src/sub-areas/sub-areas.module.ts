import { Module } from '@nestjs/common';
import { SubAreasService } from './sub-areas.service';
import { SubAreasController } from './sub-areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubArea, SubAreaSchema } from './schemas/sub-area.schema';
import { SubAreaRoomsModule } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubArea.name, schema: SubAreaSchema }]),
    SubAreaRoomsModule,
  ],
  controllers: [SubAreasController],
  providers: [SubAreasService],
  exports: [SubAreasService],
})
export class SubAreasModule {}
