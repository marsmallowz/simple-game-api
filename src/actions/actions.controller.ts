import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { WearEquipmentActionDto } from './dto/wear-equipment-action.dto';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionService: ActionsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('use-consumable')
  useConsumable(@Req() request, @Body() body: { consumableId: string }) {
    return this.actionService.useConsumable(request.user, body.consumableId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('wear-equipment')
  wearEquipment(
    @Req() request,
    @Body() wearEquipmentActionDto: WearEquipmentActionDto,
  ) {
    return this.actionService.wearEquipment(
      request.user,
      wearEquipmentActionDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('un-wear-equipment')
  unWearEquipment(
    @Req() request,
    @Body() wearEquipmentActionDto: WearEquipmentActionDto,
  ) {
    return this.actionService.unWearEquipment(
      request.user,
      wearEquipmentActionDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('user-take-quest')
  takeQuest(@Req() request, @Body() body: { questId: string }) {
    return this.actionService.takeQuest(request.user, body.questId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('user-report-quest')
  reportQuest(
    @Req() request,
    @Body() body: { userQuestId: string; npcId: string },
  ) {
    return this.actionService.reportQuest(
      request.user,
      body.userQuestId,
      body.npcId,
    );
  }
}
