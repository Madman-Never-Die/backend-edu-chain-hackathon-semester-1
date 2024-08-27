import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, FindManyOptions, Repository} from 'typeorm';
import {RequestCreateQuestsDto} from './dto/requestCreateQuestsDto';
import {Quest} from './quests.entity';
import {Question} from "./question.entity";
import {Answer} from "./answer.entity";
import {User} from "../users/user.entity";
import {ParticipantEntity} from "../participant.entity";
import {UserQuestAnswer} from "../users/userQuestAnswer";

@Injectable()
export class QuestsService {
  constructor(
      @InjectRepository(Quest)
      private questsRepository: Repository<Quest>,
      @InjectRepository(User)
      private userRepository: Repository<User>,
      @InjectRepository(ParticipantEntity)
      private participantRepository: Repository<ParticipantEntity>,
      @InjectRepository(Question)
      private questionRepository: Repository<Question>,
      @InjectRepository(UserQuestAnswer)
      private userQuestAnswerRepository: Repository<UserQuestAnswer>,
  ) {}


  async processQuestSubmission(
      questId: number,
      userWalletAddress: string,
      selectedAnswers: Record<string, { id: number; content: string; correctAnswer: boolean }>,
      isLiked: boolean
  ): Promise<any> {
    // 1. 해당 유저가 이미 퀘스트에 참여했는지 확인
    const user = await this.userRepository.findOne({ where: { wallet_address: userWalletAddress } });
    if (!user) {
      throw new ConflictException('User not found');
    }

    const existingParticipation = await this.participantRepository.findOne({
      where: {
        user: { id: user.id },
        quest: { id: BigInt(questId) }
      }
    });

    if (existingParticipation) {
      throw new ConflictException('User has already participated in this quest');
    }

    // 2. 퀘스트와 질문들 가져오기
    const quest = await this.questsRepository.findOne({
      where: { id: BigInt(questId) },
      relations: ['questions']
    });
    if (!quest) {
      throw new ConflictException('Quest not found');
    }

    // 3. 각 질문에 대한 답변 처리 및 UserQuestAnswer 생성
    let allQuestionsAnswered = true;
    for (const question of quest.questions) {
      const selectedAnswer = selectedAnswers[question.id.toString()];
      if (!selectedAnswer) {
        allQuestionsAnswered = false;
        break;
      }

      const userQuestAnswer = this.userQuestAnswerRepository.create({
        user,
        quest,
        question,
        is_correct: selectedAnswer.correctAnswer,
        answer_content: JSON.stringify(selectedAnswer),
      });
      await this.userQuestAnswerRepository.save(userQuestAnswer);
    }

    // 4. 참가자 테이블에 정보 추가
    const newParticipation = this.participantRepository.create({
      user,
      quest,
      is_completed: allQuestionsAnswered,
    });
    await this.participantRepository.save(newParticipation);

    // 5. 퀘스트의 참가자 수 증가 및 좋아요 처리
    quest.participation += 1;
    if (isLiked) {
      quest.likes += 1;
    }
    await this.questsRepository.save(quest);

    return {
      message: 'Quest submission processed successfully',
      isCompleted: allQuestionsAnswered,
      participation: quest.participation,
      likes: quest.likes,
    };
  }

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
      participation: quest.participation,
      likes: quest.likes,
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
    const questId = BigInt(id); // Convert the number to bigint
    const quest = await this.questsRepository.findOne({ where: { id: questId } });
    if (!quest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    quest.participation += 1;
    return this.questsRepository.save(quest);
  }


  async deleteQuests(id: number): Promise<boolean> {
    try {
      const questId = BigInt(id);
      const quest = await this.questsRepository.findOne({ where: { id: questId } });

      if (!quest) {
        throw new NotFoundException(`Quest with ID ${id} not found`);
      }

      const result = await this.questsRepository.remove(quest);
      console.log('Deleted quest:', result);

      return true;
    } catch (error) {
      console.error('퀘스트 삭제 중 오류 발생:', error);
      return false;
    }
  }

}
