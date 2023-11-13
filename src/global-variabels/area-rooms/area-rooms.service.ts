import { Injectable } from '@nestjs/common';

@Injectable()
export class AreaRoomsService {
  public areaRooms: Map<string, { id: string; email: string }[]> = new Map();
}
