import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
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

  @Get('count-by-provider')
  async getQuestCountByProvider(@Query('walletAddress') walletAddress: string): Promise<{ count: number }> {
    const count = await this.questsService.getQuestCountByProvider(walletAddress);
    return { count };
  }

  @Get('total-participation')
  async getTotalParticipation(@Query('walletAddress') walletAddress: string): Promise<{ totalParticipation: number }> {
    const totalParticipation = await this.questsService.getTotalParticipation(walletAddress);
    return { totalParticipation };
  }

  @Get('recent')
  async getRecentQuests(
      @Query('walletAddress') walletAddress: string,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
  ): Promise<{ quests: Quest[], total: number, page: number, limit: number }> {
    return this.questsService.getRecentQuests(walletAddress, page, limit);
  }

  @Post(':id/participate')
  async participateInQuest(@Param('id') id: number): Promise<Quest> {

    return this.questsService.incrementParticipation(id);
  }
}
