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
import { NewTreesService } from 'src/new-trees/new-trees.service';
import { NewMonstersService } from 'src/new-monsters/new-monsters.service';
import { SubAreaRoomsService } from 'src/global-variabels/sub-area-rooms/sub-area-rooms.service';
import { SubAreasService } from 'src/sub-areas/sub-areas.service';
import { UniqueTokenStorage } from 'src/auth/unique-token.storage';

// transports: ['websocket'],
@WebSocketGateway({ namespace: 'areas' })
export class AreasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly areaService: AreasService,
    private readonly userService: UsersService,
    private readonly newTreeService: NewTreesService,
    private readonly newMonsterService: NewMonstersService,
    private readonly subAreaService: SubAreasService,
    private readonly subAreaRoomsService: SubAreaRoomsService,
    private readonly uniqueTokenStorage: UniqueTokenStorage,
  ) {}
  @WebSocketServer() server: Server;
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private battleRooms: Map<string, any[]> = new Map();

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
      const user: any = await this.userService.findOne(userId);
      const userIdString: string = user._id.toString();
      const position = await this.subAreaService.findOneBasic(user.position);
      const positionIdString: string = position._id.toString();
      client.join(positionIdString);
      if (this.subAreaRoomsService.subAreaRooms.has(positionIdString)) {
        const currentRooms =
          this.subAreaRoomsService.subAreaRooms.get(positionIdString);
        currentRooms.push({
          id: userIdString,
          email: user.email,
        });
        this.subAreaRoomsService.subAreaRooms.set(
          positionIdString,
          currentRooms,
        );
      } else {
        this.subAreaRoomsService.subAreaRooms.set(positionIdString, [
          {
            id: userIdString,
            email: user.email,
          },
        ]);
      }
      this.server.to(positionIdString).emit('joinSubArea', {
        id: userIdString,
        email: user.email,
        position: positionIdString,
      });
      const area = await this.areaService.findOne(position.areaId);
      client.emit('getAreaDetails', {
        area: area,
        users: this.subAreaRoomsService.subAreaRooms.get(positionIdString),
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
        const user: any = await this.userService.findOne(userId);
        const userIdString: string = user._id.toString();
        const position = await this.subAreaService.findOneBasic(user.position);
        const positionIdString: string = position._id.toString();
        // remove from battleRooms
        const subArea: any =
          await this.subAreaService.findOne(positionIdString);
        for (const monster of subArea.subAreaDetails.monsters) {
          if (this.battleRooms.has(monster._id.toString())) {
            const currentPlayers = this.battleRooms
              .get(monster._id.toString())
              .filter((userX) => userX.id !== userIdString);
            this.battleRooms.set(monster._id.toString(), currentPlayers);
          }
        }
        // remove from subAreaRooms
        if (this.subAreaRoomsService.subAreaRooms.has(positionIdString)) {
          console.log('Yang keluar:', user.email);
          const currentRooms = this.subAreaRoomsService.subAreaRooms
            .get(positionIdString)
            .filter((userx) => userx.id !== userIdString);
          this.subAreaRoomsService.subAreaRooms.set(
            positionIdString,
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
    const user = await this.authService.checkTokenOnRedis(userId, token);
    if (user !== null) {
      const position: any = user.position;
      const positionString: string = position._id.toString();
      try {
        const monster = await this.newMonsterService.findOne(data.monsterId);
        // hanya baru bisa berfungsi agar tidak menyerang monster yang sudah mati
        if (monster.currentHp <= 0) {
          return this.server.to(positionString).emit('actionMonster', {
            massage: 'Monster has been killed',
          });
        }

        // client.join(data.monsterId);
        // ada masalah data di battleRooms tidak terupdate jika pengguna leave subarea
        if (this.battleRooms.has(data.monsterId)) {
          const currentPlayers = this.battleRooms.get(data.monsterId);
          const hasUser = currentPlayers.some(
            (userX) => userX.id === user.id.toString(),
          );
          if (!hasUser) {
            currentPlayers.push({
              id: user.id.toString(),
              email: user.email,
              damage: 0,
            });
          }
          this.battleRooms.set(data.monsterId, currentPlayers);
        } else {
          this.battleRooms.set(data.monsterId, [
            { id: user.id.toString(), email: user.email, damage: 0 },
          ]);
        }
        const result: any = await this.newMonsterService.attackMonster({
          userId: user.id.toString(),
          monsterId: data.monsterId,
        });

        const users = this.battleRooms.get(data.monsterId);
        const newUsers = users.map((item) => {
          if (item.id === user.id.toString()) {
            return { ...item, damage: item.damage + result.damage };
          } else {
            return item;
          }
        });

        this.battleRooms.set(data.monsterId, newUsers);

        if (result.monster) {
          console.log(result.monster);
          this.server.to(positionString).emit('attackMonster', {
            email: user.email,
            monsterName: result.monster.monster.name,
            monsterId: result.monster._id.toString(),
            damage: result.damage,
          });
          if (result.monster.currentHp <= 0) {
            for (const user of this.battleRooms.get(data.monsterId)) {
              const calculateResult =
                await this.newMonsterService.calculateExpAndDrop({
                  userId: user.id,
                  damage: user.damage,
                  monsterId: data.monsterId,
                });
              this.server.to(positionString).emit('getDrop', {
                email: user.email,
                monsterName: result.monster.monster.name,
                exp: calculateResult.item,
              });
              this.server.to(positionString).emit('getExp', {
                email: user.email,
                monsterName: result.monster.monster.name,
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
            this.server.to(positionString).emit('monsterDefeat', {
              email: user.email,
              monsterName: result.monster.monster.name,
            });
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
            const result: any = await this.newMonsterService.monsterAttack({
              userId: users[randomNum].id,
              monsterId: data.monsterId,
            });
            if (result.user) {
              this.server.to(positionString).emit('monsterAttack', {
                email: result.user.email,
                attack: result.monster.attack,
                monsterName: result.monster.monster?.name,
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
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    // const token = client.handshake.headers.auth as string;
    const userId = client.handshake.headers.userid as string;
    try {
      const user = await this.userService.findOne(userId);
      const result: any = await this.newTreeService.reduceQuantity(
        data.treeId,
        userId,
      );
      if (result) {
        this.server.emit('cuttingTree', {
          email: user.email,
          treeId: result._id,
          treeName: result.tree.name,
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
      const subArea: any = await this.subAreaService.findOne(
        data.leavePosition,
      );
      for (const monster of subArea.subAreaDetails.monsters) {
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
            (userX: any) => userX.id === user._id.toString(),
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
        // const area = await this.areaService.findOne(user._id.toString());
        // client.emit('getSubAreaDetails', area);
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

// console.log(client.rooms);
// const sockets = await this.server
//   .in('652784523af8cb2c75bfe799')
//   .fetchSockets();

// for (const socket of sockets) {
//   console.log(socket.id);
//   console.log(socket.handshake);

//   console.log(socket.rooms);
//   console.log(socket.data);
// }

// contoh cara yang dapat di terapkan.
// kalau pakai jwt user bisa login dibanyak device
// makannya itu dilakukan pengecekan di redis dulu.

// contoh selanjutnya
// Jika mengakses controller yang tidak public,
// di authguardnya cukup verify jwt dan
// tidak usah cek di redis apakah begitu?
// sepertinya ada masalah ketika pengguna telah join session
// tapi melakukan fetchdata yang membutuhkan token
// apa yang terjadi jika token expired?
// gak mungkin dong log out session,
// maka terapkan refresh token,
// jika menerapkan refresh token, maka nanti token akan berubah
// lalu apakah itu nanti akan menyebabkan masalah?
// ada masalah, ketika pembahruan auth ketika ada perubahan di
// state auth maka aplikasi akan dijalankan ulang
//
// apakah perlu membedakan token untuk session dengan token jwt?
// juga belum tau

// masalahnya adalah karena validate membutuhkan userId
// jadi akan di terapkan jwt
// masalahnya saat jwt expire maka userId tidak dapat ditemukan.
// apa yang terjadi jika userId tidak dapat ditemukan?
// pembersihan room tidak dapat dilakukan.
