import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';
import {RequestCreateQuestsDto} from './dto/requestCreateQuestsDto';
import {Quests} from './quests.entity';
import {Question} from "./question.entity";
import {Answer} from "./answer.entity";

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quests)
    private questsRepository: Repository<Quests>,
  ) {}

  // async createQuests(createQuestDto: RequestCreateQuestsDto): Promise<Quests> {
  //   const { questions, ...questData } = createQuestDto;
  //
  //   const quest = this.questsRepository.create({
  //     ...questData,
  //     questions: questions.map((questionDto) => {
  //       // Create the answers first
  //       const answers = questionDto.answers.map((answerDto) => {
  //         return this.questsRepository.manager.create(Answer, {
  //           content: answerDto.content,
  //         } as DeepPartial<Answer>);
  //       });
  //
  //       // Create the question with associated answers
  //       return this.questsRepository.manager.create(Question, {
  //         question: questionDto.question,
  //         correct_answer: questionDto.correctAnswer,
  //         answers: answers,
  //       } as DeepPartial<Question>);
  //     }),
  //   });
  //
  //   return this.questsRepository.save(quest);
  // }
  async createQuests(createQuestDto: RequestCreateQuestsDto): Promise<Quests> {
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
