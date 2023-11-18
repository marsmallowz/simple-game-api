import { Controller, Get, Param } from '@nestjs/common';
import { SubAreaRoomsService } from './sub-area-rooms.service';

@Controller('sub-area-rooms')
export class SubAreaRoomsController {
  constructor(private readonly subAreaRoomsService: SubAreaRoomsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAreaRoomsService.findOne(id);
  }
}
