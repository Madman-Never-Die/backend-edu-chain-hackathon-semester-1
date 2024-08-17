import {Injectable} from '@nestjs/common';
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


}

