import {Body, Controller, Get, Post} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { RequestCreateQuestsDto } from './dto/requestCreateQuestsDto';
import { Quest } from './quests.entity';
import {QuestDto} from "./dto/quests.dto";

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}


  @Get()
  async getQuestList(): Promise<QuestDto[]> {
    return this.questsService.getQuestList();
  }

  @Post()
  async createQuest(@Body() createShortsDto: RequestCreateQuestsDto): Promise<Quest> {
    return this.questsService.createQuest(createShortsDto);
  }
}
