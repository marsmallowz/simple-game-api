import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AreasService } from './areas.service';
import { UsersService } from 'src/users/users.service';
import { SubAreaRoomsService } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.service';
import { SubAreasService } from 'src/sub-areas/sub-areas.service';
import { UniqueTokenStorage } from 'src/auth/unique-token.storage';
import { MonstersService } from 'src/monsters/monsters.service';
import { BattlesService } from 'src/battles/battles.service';
import { TreesService } from 'src/trees/trees.service';

// transports: ['websocket'],
@WebSocketGateway({ namespace: 'areas' })
export class AreasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly areaService: AreasService,
    private readonly userService: UsersService,
    private readonly treeService: TreesService,
    private readonly monsterService: MonstersService,
    private readonly subAreaService: SubAreasService,
    private readonly battleService: BattlesService,
    private readonly subAreaRoomsService: SubAreaRoomsService,
    private readonly uniqueTokenStorage: UniqueTokenStorage,
  ) {}
  @WebSocketServer() server: Server;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private battleRooms: Map<
    string,
    { id: string; email: string; damage: number }[]
  > = new Map();

  async handleConnection(client: Socket) {
    // const token = client.handshake.auth.token;
    const token = client.handshake.headers.auth as string;
    const userId = client.handshake.headers.userid as string;
    try {
      const isValid = await this.uniqueTokenStorage.validate(userId, token);
      if (isValid) {
        client.disconnect(true);
        return;
      }
      await this.uniqueTokenStorage.insert(userId, token);
      const user = await this.userService.findOne(userId);
      const userIdString: string = user._id.toString();
      client.join(user.position.toString());
      if (this.subAreaRoomsService.subAreaRooms.has(user.position.toString())) {
        const currentRooms = this.subAreaRoomsService.subAreaRooms.get(
          user.position.toString(),
        );
        currentRooms.push({
          id: userIdString,
          email: user.email,
        });
        this.subAreaRoomsService.subAreaRooms.set(
          user.position.toString(),
          currentRooms,
        );
      } else {
        this.subAreaRoomsService.subAreaRooms.set(user.position.toString(), [
          {
            id: userIdString,
            email: user.email,
          },
        ]);
      }
      this.server.to(user.position.toString()).emit('joinSubArea', {
        id: userIdString,
        email: user.email,
        position: user.position.toString(),
      });
      const subArea = await this.subAreaService.findOne(
        user.position.toString(),
      );
      const area = await this.areaService.findOne(subArea.areaId);
      const subAreas = await this.subAreaService.findAll({
        areaId: area._id.toString(),
      });
      client.emit('getAreaDetails', {
        area: area,
        subAreas: subAreas,
        users: this.subAreaRoomsService.subAreaRooms.get(
          user.position.toString(),
        ),
      });
      console.log('Autentikasi Berhasil');
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers.auth as string;
    const userId = client.handshake.headers.userid as string;
    try {
      const isValid = await this.uniqueTokenStorage.validate(userId, token);
      if (isValid) {
        const user = await this.userService.findOne(userId);
        const userIdString: string = user._id.toString();
        // remove from battleRooms
        const subArea = await this.subAreaService.findOne(
          user.position.toString(),
        );
        const monsters = await this.monsterService.findAll({
          subAreaId: subArea._id.toString(),
        });
        for (const monster of monsters) {
          if (this.battleRooms.has(monster._id.toString())) {
            const currentPlayers = this.battleRooms
              .get(monster._id.toString())
              .filter((userX) => userX.id !== userIdString);
            this.battleRooms.set(monster._id.toString(), currentPlayers);
          }
        }
        // remove from subAreaRooms
        if (
          this.subAreaRoomsService.subAreaRooms.has(user.position.toString())
        ) {
          console.log('Yang keluar:', user.email);
          const currentRooms = this.subAreaRoomsService.subAreaRooms
            .get(user.position.toString())
            .filter((userx) => userx.id !== userIdString);
          this.subAreaRoomsService.subAreaRooms.set(
            user.position.toString(),
            currentRooms,
          );
        }
        await this.authService.removeAccessTokenOnRedis(userId);
      }
      console.log('Ada yang keluar:', client.id);
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  @SubscribeMessage('attackMonster')
  async handleAttackMonster(
    @MessageBody() data: { monsterId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.headers.auth as string;
    const userId = client.handshake.headers.userid as string;
    const userX = await this.authService.checkTokenOnRedis(userId, token);
    const user = await this.userService.findOne(userX.id.toString());
    if (userX !== null) {
      const positionString = userX.position.toString();
      try {
        const monster = await this.monsterService.findOne(data.monsterId);
        // hanya baru bisa berfungsi agar tidak menyerang monster yang sudah mati
        if (user.currentHp <= 0) {
          return client.emit('system', {
            message: 'Cannot attack you have been killed.',
          });
        }

        if (monster.currentHp <= 0) {
          return client.emit('system', {
            message: 'Monster has been killed.',
          });
        }

        // client.join(data.monsterId);
        // ada masalah data di battleRooms tidak terupdate jika pengguna leave subarea
        if (this.battleRooms.has(data.monsterId)) {
          const currentPlayers = this.battleRooms.get(data.monsterId);
          const hasUser = currentPlayers.some(
            (userX) => userX.id === userX.id.toString(),
          );
          if (!hasUser) {
            currentPlayers.push({
              id: userX.id.toString(),
              email: userX.email,
              damage: 0,
            });
          }

          this.battleRooms.set(data.monsterId, currentPlayers);
        } else {
          this.battleRooms.set(data.monsterId, [
            { id: userX.id.toString(), email: userX.email, damage: 0 },
          ]);
        }
        const result = await this.battleService.attackMonster({
          userId: userX.id.toString(),
          monsterId: data.monsterId,
        });

        const users = this.battleRooms.get(data.monsterId);
        const newUsers = users.map((item) => {
          if (item.id === userX.id.toString()) {
            return { ...item, damage: item.damage + result.damage };
          } else {
            return item;
          }
        });

        this.battleRooms.set(data.monsterId, newUsers);

        if (result.monster) {
          this.server.to(positionString).emit('attackMonster', {
            email: userX.email,
            monsterName: result.monster.name,
            monsterId: result.monster._id.toString(),
            damage: result.damage,
          });
          if (result.monster.currentHp <= 0) {
            this.server.to(positionString).emit('monsterDefeat', {
              email: userX.email,
              monsterName: result.monster.name,
            });
            for (const user of this.battleRooms.get(data.monsterId)) {
              const calculateResult =
                await this.battleService.calculateExpAndDrop({
                  userId: user.id,
                  damage: user.damage,
                  monsterId: data.monsterId,
                });
              this.server.to(positionString).emit('getDrop', {
                email: user.email,
                monsterName: result.monster.name,
                drops: calculateResult.item,
              });
              this.server.to(positionString).emit('getExp', {
                email: user.email,
                monsterName: result.monster.name,
                exp: calculateResult.exp,
              });
              if (calculateResult.levelUp) {
                this.server.to(positionString).emit('levelUp', {
                  email: user.email,
                  level: calculateResult.level,
                  pointLeft: calculateResult.pointLeft,
                });
              }
            }

            this.battleRooms.delete(data.monsterId);
            this.clearIntervalForRoom(data.monsterId);
            return;
          }
        }
        if (this.intervals.has(data.monsterId)) {
          return;
        }
        const interval = setInterval(async () => {
          const users: { id: string; email: string }[] = this.battleRooms.get(
            data.monsterId,
          );
          if (users.length) {
            const randomNum = Math.round(Math.random() * (users.length - 1));
            const result = await this.battleService.monsterAttack({
              userId: users[randomNum].id,
              monsterId: data.monsterId,
            });
            if (result.user) {
              this.server.to(positionString).emit('monsterAttack', {
                email: result.user.email,
                attack: result.monster.attack,
                monsterName: result.monster.name,
              });
              if (result.user.currentHp === 0) {
                console.log('Pengguna telah mati');
                this.battleRooms.set(
                  data.monsterId,
                  this.battleRooms
                    .get(data.monsterId)
                    .filter((user) => user.id !== users[randomNum].id),
                );
                this.server
                  .to(positionString)
                  .emit('playerDefeat', { userId: users[randomNum].id });
              }
            }
          } else {
            console.log('Bersihkan battle room');
            this.battleRooms.delete(data.monsterId);
            this.clearIntervalForRoom(data.monsterId);
          }
        }, 5000);
        this.intervals.set(data.monsterId, interval);
      } catch (error) {
        console.log(error);
      }
    } else {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('cuttingTree')
  async handleCuttingTree(
    @MessageBody() data: { treeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const token = client.handshake.headers.auth as string;
    const userId = client.handshake.headers.userid as string;
    const userX = await this.authService.checkTokenOnRedis(userId, token);
    try {
      const user = await this.userService.findOne(userX.id.toString());
      if (user.currentHp <= 0) {
        return client.emit('system', {
          message: 'Cannot interact with tree you have been killed.',
        });
      }
      // harusnya buat pengecekan apakah quantity tree ada
      const result = await this.treeService.reduceQuantity(data.treeId, userId);
      if (result) {
        this.server.emit('cuttingTree', {
          email: user.email,
          treeId: result._id.toString(),
          treeName: result.name,
          currentQuantity: result.quantity,
        });
        return;
      }
      // harusnya bikin lagi emit jika gagal cutting down tree
    } catch (error) {
      console.log(error);
      client.disconnect(true);
    }
  }

  @SubscribeMessage('joinSubArea')
  async adaYangGabung(
    @MessageBody()
    data: { email: string; joinPosition: string; leavePosition: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('joinSubArea');
    try {
      const user = await this.userService.updateUsersPosition(
        data.email,
        data.joinPosition,
      );
      const subArea = await this.subAreaService.findOne(data.leavePosition);
      const monsters = await this.monsterService.findAll({
        subAreaId: subArea._id.toString(),
      });
      for (const monster of monsters) {
        if (this.battleRooms.has(monster._id.toString())) {
          const currentPlayers = this.battleRooms
            .get(monster._id.toString())
            .filter((userX) => userX.id !== user._id.toString());
          this.battleRooms.set(monster._id.toString(), currentPlayers);
        }
      }
      if (user) {
        client.leave(data.leavePosition);
        client.join(data.joinPosition);
        if (this.subAreaRoomsService.subAreaRooms.has(data.joinPosition)) {
          const currentRooms = this.subAreaRoomsService.subAreaRooms.get(
            data.joinPosition,
          );
          const foundUser = currentRooms.find(
            (userX) => userX.id === user._id.toString(),
          );
          if (!foundUser) {
            currentRooms.push({
              id: user._id.toString(),
              email: user.email,
            }),
              this.subAreaRoomsService.subAreaRooms.set(
                data.joinPosition,
                currentRooms,
              );
          }
        } else {
          this.subAreaRoomsService.subAreaRooms.set(data.joinPosition, [
            {
              id: user._id.toString(),
              email: user.email,
            },
          ]);
        }
        this.server.to(data.joinPosition).emit('joinSubArea', {
          id: user._id.toString(),
          email: data.email,
          joinPosition: data.joinPosition,
          leavePosition: data.leavePosition,
        });
      }
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  private clearIntervalForRoom(roomId: string) {
    const interval = this.intervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(roomId);
    }
  }
}
