import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionService: ActionsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('use-consumable')
  useConsumable(@Req() request, @Body() body: { consumableId: string }) {
    return this.actionService.useConsumable(request.user, body.consumableId);
  }
}
