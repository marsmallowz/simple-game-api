import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class SubAreaRoomsService {
  public subAreaRooms: Map<
    string,
    { id: string; email: string; username: string }[]
  > = new Map();

  findOne(id: string) {
    return this.subAreaRooms.get(id);
  }
}
