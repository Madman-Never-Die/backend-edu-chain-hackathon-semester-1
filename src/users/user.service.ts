import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {Role} from "../role/role.entity";
import {ParticipantEntity} from "../participant.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(ParticipantEntity)
    private participantRepository: Repository<ParticipantEntity>,
  ) {}

  async checkWallet(walletAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { wallet_address: walletAddress },
      relations: ['role']
    });

    if (user) {
      return {
        exists: true,
        walletAddress: user.wallet_address,
        role: user.role.role,
        nickname: user.nickname
      };
    } else {
      return { exists: false };
    }
  }

  async createUser(nickname: string, walletAddress: string, roleId: number) {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Invalid role');
    }

    // const nickname = this.generateRandomNickname();

    const newUser = this.usersRepository.create({
      wallet_address: walletAddress,
      role,
      nickname,
    });

    await this.usersRepository.save(newUser);

    return {
      walletAddress: newUser.wallet_address,
      role: role.role,
      nickname: newUser.nickname
    };
  }

  private generateRandomNickname(): string {
    const adjectives = ['Happy', 'Lucky', 'Sunny', 'Clever', 'Swift'];
    const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Lion'];
    const randomNumber = Math.floor(Math.random() * 1000);

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}${randomNumber}`;
  }

  async getQuestsByWalletAddress(walletAddress: string) {
    const user = await this.usersRepository.findOne({ where: { wallet_address: walletAddress } });
    if (!user) {
      throw new NotFoundException(`User with wallet address ${walletAddress} not found`);
    }

    const participations = await this.participantRepository.find({
      where: { user: { id: user.id } },
      relations: ['quest', 'quest.questions'],
    });

    return participations.map(participation => ({
      questId: participation.quest.id,
      title: participation.quest.title,
      content: participation.quest.content,
      type: participation.quest.type,
      startDate: participation.quest.start_date,
      endDate: participation.quest.end_date,
      status: participation.quest.status,
      questionCount: participation.quest.questions.length,
    }));
  }


}
