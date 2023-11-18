import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/areas.module';
import { SubAreasModule } from './sub-areas/sub-areas.module';
import { TreesModule } from './trees/trees.module';
import { MonstersModule } from './monsters/monsters.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { ConsumablesModule } from './consumables/consumables.module';
import { SubAreaRoomsModule } from './global-variabels/sub-area-rooms/sub-area-rooms.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { InventoriesModule } from './inventories/inventories.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UniqueTokenStorage } from './auth/unique-token.storage';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { BattlesModule } from './battles/battles.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    AuthModule,
    UsersModule,
    AreasModule,
    SubAreasModule,
    TreesModule,
    MonstersModule,
    RawMaterialsModule,
    ConsumablesModule,
    SubAreaRoomsModule,
    InventoriesModule,
    TasksModule,
    BattlesModule,
    ActionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    UniqueTokenStorage,
  ],
})
export class AppModule {}
