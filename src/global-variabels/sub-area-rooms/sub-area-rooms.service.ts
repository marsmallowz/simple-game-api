import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class SubAreaRoomsService {
  public subAreaRooms: Map<string, { id: string; email: string }[]> = new Map();
}
