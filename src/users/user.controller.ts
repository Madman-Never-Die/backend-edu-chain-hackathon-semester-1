import {Controller, Get, Param, Delete, Post, Body} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check-wallet')
  async checkWallet(@Body('walletAddress') walletAddress: string) {
    return this.userService.checkWallet(walletAddress);
  }

  @Post('create')
  async createUser(@Body() userData: { nickname: string, walletAddress: string; roleId: number }) {
    return this.userService.createUser(
      userData.nickname,
      userData.walletAddress,
      userData.roleId,
    );
  }

  // dashboard
  @Get(':walletAddress/quests')
  async getUserQuests(@Param('walletAddress') walletAddress: string) {
    return this.userService.getQuestsByWalletAddress(walletAddress);
  }

}
