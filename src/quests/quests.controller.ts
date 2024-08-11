import { Body, Controller, Post } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { RequestCreateQuestsDto } from './dto/requestCreateQuestsDto';
import { Quests } from './quests.entity';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  async createShorts(@Body() createShortsDto: RequestCreateQuestsDto): Promise<Quests> {
    return this.questsService.createQuests(createShortsDto);
  }
}
