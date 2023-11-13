import { Module } from '@nestjs/common';
import { SubAreaRoomsService } from './sub-area-rooms.service';

@Module({
  providers: [SubAreaRoomsService],
  exports: [SubAreaRoomsService],
})
export class SubAreaRoomsModule {}
