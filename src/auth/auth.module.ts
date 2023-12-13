import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HashingService } from '../hashing/hashing.service';
import { BcryptService } from '../hashing/bcrypt.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { UniqueTokenStorage } from './unique-token.storage';
import {
  Inventory,
  InventorySchema,
} from 'src/inventories/schemas/inventory.schema';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import {
  UserQuest,
  UserQuestSchema,
} from 'src/user-quests/schemas/user-quest.schema';

// kalau tidak akan error saat penggunaan jwt
dotenv.config(); // Load .env file

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: UserQuest.name, schema: UserQuestSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '11h' },
    }),
    ConfigModule.forFeature(jwtConfig),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UniqueTokenStorage,
    RefreshTokenIdsStorage,
  ],
  exports: [AuthService],
})
export class AuthModule {}
