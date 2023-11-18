import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { HashingService } from 'src/hashing/hashing.service';
import { User } from 'src/users/schemas/user.schema';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import {
  InvalidatedUniqueTokenError,
  UniqueTokenStorage,
} from './unique-token.storage';
import { Inventory } from 'src/inventories/schemas/inventory.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { randomUUID } from 'crypto';
import { ActiveUserData } from './interface/actice-user-data.interface';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { RefreshTokenDto } from './dto/resfresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    private readonly mailerService: MailerService,
    private readonly hasingService: HashingService,
    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly uniqueTokenStorage: UniqueTokenStorage,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userModel.findOne({
        email: signInDto.email,
      });
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }
      if (!user.verification) {
        throw new UnauthorizedException('User not verified');
      }
      const isEqual = await this.hasingService.compare(
        signInDto.password,
        user.password,
      );
      if (!isEqual) {
        throw new UnauthorizedException('Password does not match');
      }
      return await this.generateTokens({
        id: user._id.toString(),
        email: user.email,
        inventoryId: user.inventory.toString(),
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async signUp(signUpDto: SignUpDto) {
    const session = await this.connection.startSession();
    function generateRandomNumber(): number {
      return Math.floor(Math.random() * 5) + 1;
    }
    if (signUpDto.password !== signUpDto.rePassword) {
      throw new BadRequestException('Password and reset password do not match');
    }
    try {
      session.startTransaction();
      const user = new User();
      user.email = signUpDto.email;

      user.password = await this.hasingService.hash(signUpDto.password);
      const createdInventory = await this.inventoryModel.create(
        [
          {
            rawMaterials: [],
          },
        ],
        { session: session },
      );
      const randomInt = generateRandomNumber();
      const randomStr = generateRandomNumber();
      const randomVit = generateRandomNumber();
      const randomDex = generateRandomNumber();
      const randomLuck = generateRandomNumber();
      const fixHp = 100 + randomVit * 5;
      const fixMp = 50 + randomInt * 2;
      const userX = await this.userModel.create(
        [
          {
            username: user.email,
            hp: fixHp,
            mp: fixMp,
            currentHp: fixHp,
            currentMp: fixMp,
            attack: 6 + randomStr * 3,
            magicAttack: 4 + randomInt * 2,
            defense: 4 + randomVit * 2,
            magicDefense: 3 + randomInt * 1,
            int: randomInt,
            str: randomStr,
            vit: randomVit,
            dex: randomDex,
            luck: randomLuck,
            email: user.email,
            password: user.password,
            inventory: createdInventory[0],
          },
        ],
        { session: session },
      );

      const token = await this.signToken(
        userX[0]._id.toString(),
        this.jwtConfiguration.accesTokenTtl,
        {
          email: user.email,
        },
      );
      userX[0].token = token;
      await userX[0].save();
      const websiteLink = `${process.env.WEB_URL}/auth/verify?token=${token}`;
      const newTabLink = `<a href="${websiteLink}" target="_blank">disini</a>`;
      await this.mailerService.sendMail({
        to: 'alsandymaulana@gmail.com',
        from: `${process.env.EMAIL_USER}`,
        subject: 'Validation account Simple Game',
        html: `Halo #marsmallowz,<br><br>untuk verfikasi silahkan klik ${newTabLink}.<br><br>Terima kasih!`,
      });
      await session.commitTransaction();
      session.endSession();
      return {
        email: userX[0].email,
      };
    } catch (error) {
      console.log(error);

      await session.abortTransaction();
      session.endSession();
      if (error.code === 11000) {
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async emailVerification(token: string) {
    try {
      const result = await this.jwtService.verify(token);
      const user = await this.userModel.findOne({
        email: result.email,
        token: token,
      });
      if (user === null) {
        throw new NotFoundException();
      }
      user.verification = true;
      user.token = '';
      await user.save();
      return { verification: 'success' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async forgetPassword(token: string, password: string) {
    try {
      const result = await this.jwtService.verify(token);
      const user = await this.userModel.findOne({
        email: result.email,
        token: true,
        verification: true,
      });
      if (user === null) {
        throw new NotFoundException();
      }
      user.token = '';
      user.password = await this.hasingService.hash(password);
      await user.save();
      return { verification: 'success' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async requestForgetPassword(email: string) {
    try {
      const user = await this.userModel.findOne({
        email: email,
        verification: true,
      });
      if (user === null) {
        throw new NotFoundException();
      }
      const token = await this.signToken(
        user._id.toString(),
        this.jwtConfiguration.accesTokenTtl,
        {
          email: email,
        },
      );
      const websiteLink = `${process.env.WEB_URL}/auth/verify?token=${token}`;
      const newTabLink = `<a href="${websiteLink}" target="_blank">disini</a>`;
      await this.mailerService.sendMail({
        to: 'alsandymaulana@gmail.com',
        from: `${process.env.EMAIL_USER}`,
        subject: 'Validation account Simple Game',
        html: `Halo #marsmallowz,<br><br>untuk verfikasi silahkan klik ${newTabLink}.<br><br>Terima kasih!`,
      });
      user.token = token;
      await user.save();
      return { emailSent: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async requestVerify(email: string) {
    try {
      const user = await this.userModel.findOne({
        email: email,
        verification: false,
      });
      if (user === null) {
        throw new NotFoundException();
      }
      const token = await this.signToken(
        user._id.toString(),
        this.jwtConfiguration.accesTokenTtl,
        {
          email: email,
        },
      );
      const websiteLink = `${process.env.WEB_URL}/auth/verify?token=${token}`;
      const newTabLink = `<a href="${websiteLink}" target="_blank">disini</a>`;
      await this.mailerService.sendMail({
        to: 'alsandymaulana@gmail.com',
        from: `${process.env.EMAIL_USER}`,
        subject: 'Reset password account Simple Game',
        html: `Halo #marsmallowz,<br><br>untuk reset password silahkan klik ${newTabLink}.<br><br>Terima kasih!`,
      });
      user.token = token;
      await user.save();
      return { emailSent: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async checkTokenOnRedis(userId: string, token: string) {
    try {
      const isValid = await this.uniqueTokenStorage.validate(userId, token);
      if (isValid) {
        const user = await this.userModel.findById(userId);
        if (user) {
          return { id: user._id, email: user.email, position: user.position };
        } else {
          throw new NotFoundException();
        }
      } else {
        throw new InvalidatedUniqueTokenError();
      }
    } catch (error) {
      if (error instanceof InvalidatedUniqueTokenError) {
        throw new UnauthorizedException('Token is invalid');
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async removeAccessTokenOnRedis(userId: string) {
    try {
      await this.uniqueTokenStorage.invalidate(userId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await this.userModel
        .findById(userId)
        .select('-password')
        .populate('position')
        .exec();
      if (user) {
        return user;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error instanceof InvalidatedUniqueTokenError) {
        throw new UnauthorizedException('Token is invalid');
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });
      const user = await this.userModel.findById(sub);
      const isValid = await this.refreshTokenIdsStorage.validate(
        user._id.toString(),
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user._id.toString());
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens({
        id: user._id.toString(),
        email: user.email,
        inventoryId: user.inventory.toString(),
      });
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException(error);
    }
  }

  async generateTokens({
    id,
    email,
    inventoryId,
  }: {
    id: string;
    email: string;
    inventoryId: string;
  }) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        id,
        this.jwtConfiguration.accesTokenTtl,
        {
          email,
          inventoryId,
        },
      ),
      this.signToken(id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(id, refreshTokenId);
    return { userId: id, accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }
}
