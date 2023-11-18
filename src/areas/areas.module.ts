import { SubAreaRoomsModule } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.module';
import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from './schemas/area.schema';
import { SubArea, SubAreaSchema } from 'src/sub-areas/schemas/sub-area.schema';
import { AreasGateway } from './areas.gateway';
import { UsersModule } from 'src/users/users.module';
import { SubAreasModule } from 'src/sub-areas/sub-areas.module';
import { UniqueTokenStorage } from 'src/auth/unique-token.storage';
import { BattlesModule } from 'src/battles/battles.module';
import { MonstersModule } from 'src/monsters/monsters.module';
import { TreesModule } from 'src/trees/trees.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubArea.name, schema: SubAreaSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
    UsersModule,
    AuthModule,
    SubAreasModule,
    BattlesModule,
    MonstersModule,
    SubAreaRoomsModule,
    TreesModule,
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasGateway, UniqueTokenStorage],
})
export class AreasModule {}
