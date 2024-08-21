import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {Role} from "./role.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
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

  async createUser(walletAddress: string, roleId: number) {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Invalid role');
    }

    const nickname = this.generateRandomNickname();

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



}
