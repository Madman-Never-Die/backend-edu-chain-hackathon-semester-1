import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {RequestCreateQuestsDto} from './dto/requestCreateQuestsDto';
import {Quest} from './quests.entity';
import {Question} from "./question.entity";
import {Answer} from "./answer.entity";

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private questsRepository: Repository<Quest>,
  ) {}




  async getQuestList() {
    const questList = await this.questsRepository.find({
      relations: {
        questions: {
          answers: true,
        },
      },
      order: {
        id: 'ASC',
        questions: {
          id: 'ASC',
          answers: {
            id: 'ASC',
          },
        },
      },
    } as FindManyOptions<Quest>);

    return questList.map((quest) => ({
      id: quest.id,
      title: quest.title,
      content: quest.content,
      type: quest.type,
      liquidityProvider: quest.liquidity_provider,
      provider: quest.provider,
      createdAt: quest.created_at,
      modifiedAt: quest.modified_at,
      questions: quest.questions.map((question) => ({
        id: question.id,
        question: question.question,
        correctAnswer: question.correct_answer,
        answers: question.answers.map((answer, index) => ({
          id: answer.id,
          content: answer.content,
          correctAnswer: index === question.correct_answer,
        })),
      })),
    }));
  }

  async createQuest(createQuestDto: RequestCreateQuestsDto): Promise<Quest> {
    const { questions, ...questData } = createQuestDto;

    const quest = this.questsRepository.create({
      ...questData,
      questions: questions.map((questionDto) => {
        const answers = questionDto.answers.map((answerDto) => {
          return this.questsRepository.manager.create(Answer, {
            content: answerDto.content,
          });
        });

        return this.questsRepository.manager.create(Question, {
          question: questionDto.question,
          correct_answer: questionDto.correctAnswer, // 필드명이 데이터베이스와 일치하는지 확인
          answers: answers,
        });
      }),
    });

    return this.questsRepository.save(quest);
  }

  async getQuestCountByProvider(walletAddress: string): Promise<number> {
    return this.questsRepository.count({
      where: {
        provider: walletAddress
      }
    });
  }

  async getTotalParticipation(walletAddress: string): Promise<number> {
    const result = await this.questsRepository
      .createQueryBuilder('quest')
      .select('SUM(quest.participation)', 'totalParticipation')
      .where('quest.provider = :walletAddress', { walletAddress })
      .getRawOne();

    return result.totalParticipation || 0;
  }

  async getRecentQuests(
    walletAddress: string,
    page: number,
    limit: number,
  ): Promise<{ quests: Quest[]; total: number; page: number; limit: number }> {
    const [quests, total] = await this.questsRepository.findAndCount({
      where: { provider: walletAddress },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      quests,
      total,
      page,
      limit,
    };
  }

  async incrementParticipation(id: number): Promise<Quest> {
    console.log("@")
    const questId = BigInt(id); // Convert the number to bigint
    const quest = await this.questsRepository.findOne({ where: { id: questId } });
    if (!quest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    quest.participation += 1;
    return this.questsRepository.save(quest);
  }

}
