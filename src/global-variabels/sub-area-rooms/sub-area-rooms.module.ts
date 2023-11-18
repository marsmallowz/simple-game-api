import { Module } from '@nestjs/common';
import { SubAreaRoomsService } from './sub-area-rooms.service';
import { SubAreaRoomsController } from './sub-area-rooms.controller';

@Module({
  providers: [SubAreaRoomsService],
  exports: [SubAreaRoomsService],
  controllers: [SubAreaRoomsController],
})
export class SubAreaRoomsModule {}
